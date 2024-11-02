import { useState } from 'react';
import { DataTable } from '../../components/DataTable'; // Adjust path as needed

interface VLANCheckerProps {
  showRunOutput: string;
  onResult: (result: string) => void;
}

export function VLANChecker({ showRunOutput, onResult }: VLANCheckerProps) {
  const [vlansToCheck, setVlansToCheck] = useState("");
  const [tableData, setTableData] = useState<Array<Record<string, string>>>([]);

  const parseVlans = (vlanInput: string) => {
    const vlans: number[] = [];
    vlanInput.split(',').forEach((item) => {
      const trimmedItem = item.trim();
      if (trimmedItem.includes('-')) {
        const [start, end] = trimmedItem.split('-').map(Number);
        for (let i = start; i <= end; i++) {
          vlans.push(i);
        }
      } else {
        const vlan = Number(trimmedItem);
        if (!isNaN(vlan)) vlans.push(vlan);
      }
    });
    return vlans;
  };

  const extractConfiguredVlans = (output: string) => {
    const configuredVlans: { vlan: string; iface: string }[] = [];
    const vlanPattern = /(interface\s+\S+).*?vlan\s+(\d+(-\d+)?(?:,\s*\d+(-\d+)?)*)/gs;
    let match;

    while ((match = vlanPattern.exec(output)) !== null) {
      const iface = match[1].trim();
      const vlanRange = match[2];
      vlanRange.split(',').forEach((range) => {
        configuredVlans.push({ vlan: range.trim(), iface });
      });
    }

    return configuredVlans;
  };

  const handleVlanCheck = () => {
    if (!showRunOutput.trim() || !vlansToCheck.trim()) {
      onResult("Please provide both CLI output and VLANs to check.");
      return;
    }

    const vlanList = parseVlans(vlansToCheck);
    const configuredVlans = extractConfiguredVlans(showRunOutput);
    const results: Array<Record<string, string>> = [];

    vlanList.forEach((vlan) => {
      let found = false;
      configuredVlans.forEach(({ vlan: range, iface }) => {
        if (range.includes('-')) {
          const [start, end] = range.split('-').map(Number);
          if (vlan >= start && vlan <= end) {
            results.push({ VLAN: vlan.toString(), Interface: iface, Range: `${start}-${end}` });
            found = true;
          }
        } else if (Number(range) === vlan) {
          results.push({ VLAN: vlan.toString(), Interface: iface, Range: range });
          found = true;
        }
      });
      if (!found) {
        results.push({ VLAN: vlan.toString(), Interface: "Not found", Range: "N/A" });
      }
    });

    setTableData(results);
  };

  return (
    <><div className="relative mb-6">
        <div class="w-96">
          <div class="relative w-full min-w-[200px]">
          <textarea
            class="peer
            h-full
            min-h-[100px]
            w-full
            resize-none
            rounded-[7px]
            border
            border-gray-400
            bg-transparent
            px-3
            py-2.5
            font-sans
            text-sm
            font-normal
            text-blue-gray-700
            outline
            outline-0
            transition-all
            placeholder-shown:border
            placeholder-shown:border-blue-gray-200
            placeholder-shown:border-t-blue-gray-200
            focus:border-2
            focus:border-gray-900
            focus:border-t-transparent
            focus:outline-0
            disabled:resize-none
            disabled:border-0
            disabled:bg-blue-gray-50"
            placeholder="
            "></textarea>
            <label
            class="before:content['
            ']
            after:content['
            ']
            pointer-events-none
            absolute
            left-0
            -top-1.5
            flex
            h-full
            w-full
            select-none
            text-[11px]
            font-normal
            leading-tight
            text-blue-gray-400
            transition-all
            before:pointer-events-none
            before:mt-[6.5px]
            before:mr-1
            before:box-border
            before:block
            before:h-1.5
            before:w-2.5
            before:rounded-tl-md
            before:border-t
            before:border-l
            before:border-blue-gray-200
            before:transition-all
            after:pointer-events-none
            after:mt-[6.5px]
            after:ml-1
            after:box-border
            after:block
            after:h-1.5
            after:w-2.5
            after:flex-grow
            after:rounded-tr-md
            after:border-t
            after:border-r
            after:border-blue-gray-200
            after:transition-all
            peer-placeholder-shown:text-sm
            peer-placeholder-shown:leading-[3.75]
            peer-placeholder-shown:text-gray-400
            peer-placeholder-shown:before:border-transparent
            peer-placeholder-shown:after:border-transparent
            peer-focus:text-[11px]
            peer-focus:leading-tight
            peer-focus:text-gray-900
            peer-focus:before:border-t-2
            peer-focus:before:border-l-2
            peer-focus:before:border-gray-900
            peer-focus:after:border-t-2
            peer-focus:after:border-r-2
            peer-focus:after:border-gray-900
            peer-disabled:text-transparent
            peer-disabled:before:border-transparent
            peer-disabled:after:border-transparent
            peer-disabled:peer-placeholder-shown:text-gray-50">
            Message
            </label>
          </div>
        </div>
      

        <button
          onClick={handleVlanCheck}
          className="px-4 py-2 mt-2
           bg-bdazzledlight
            text-platinum 
            font-semibold 
            rounded-md
             dark:bg-bdazzledlight dark:hover:bg-bdazzled"
        >
          Check VLANs
        </button> 


        {tableData.length > 0 && (
          <DataTable
            data={tableData}
            columns={{ VLAN: "VLAN", Interface: "Interface", Range: "Range" }}
            title="VLAN Check Results" />
        )}
      </div></>
  );
}
