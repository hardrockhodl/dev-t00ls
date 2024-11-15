import { exec } from 'child_process';
import * as fs from 'fs';
import * as ip from 'ip';

// Sort subnets
function sortSubnets(subnets: string[]): string[] {
    return subnets.sort((a, b) => {
        const netA = ip.cidrSubnet(a);
        const netB = ip.cidrSubnet(b);
        return netA.firstAddress.localeCompare(netB.firstAddress) || netA.subnetMaskLength - netB.subnetMaskLength;
    });
}

// Main function to handle subnet summarization
export function summarizeSubnets(subnetsFilePath: string) {
    // Load and sort subnets
    const subnets = fs.readFileSync(subnetsFilePath, 'utf-8').split('\n').filter(Boolean);
    const sortedSubnets = sortSubnets(subnets);

    // Run aggregate6 command (replace with your environment's equivalent if needed)
    const subnetsStr = sortedSubnets.join('\n');
    exec(`echo "${subnetsStr}" | aggregate6 -4`, (error, stdout) => {
        if (error) throw error;
        const summarizedSubnets = stdout.trim().split('\n');

        const csvRows = summarizedSubnets.map(subnet => {
            const contributingSubnets = sortedSubnets.filter(original => ip.cidrSubnet(original).contains(ip.cidrSubnet(subnet).networkAddress));
            const comments = contributingSubnets.length === 1 && contributingSubnets[0] === subnet ? "Single Subnet" : "Summarization Possible";
            return [subnet, contributingSubnets.join('\n'), comments];
        });

        // Convert data to CSV format
        const csvContent = [["Summarized Subnet", "Original Subnets", "Comments"], ...csvRows]
            .map(row => row.join(';'))
            .join('\n');
        
        // Create downloadable CSV file in browser
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'summarization_report.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}