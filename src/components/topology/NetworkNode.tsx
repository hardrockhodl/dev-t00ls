import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import {
  MdLaptopMac,
  MdWifi,
} from 'react-icons/md'; // Material Icons (for routers)
import { GrGateway } from "react-icons/gr";
import { GiBrickWall } from 'react-icons/gi';
import { SiApple, SiCisco, SiVmware, SiWindows11 } from 'react-icons/si';
import { FaServer } from 'react-icons/fa';
import { BsQuestionSquare, BsWebcam } from 'react-icons/bs';
import { FcLinux, FcPrint } from 'react-icons/fc';
import { Cloud } from 'lucide-react';

const deviceIcons = {
  router: GrGateway,
  switch: SiCisco,
  firewall: GiBrickWall,
  palo: GrGateway,
  server: FaServer,
  client: MdLaptopMac,
  clientmac: SiApple,
  clientwin: SiWindows11,
  cloud: Cloud,
  default: BsQuestionSquare,
  security: BsWebcam,
  printer: FcPrint,
  accesspoint: MdWifi,
  vmware: SiVmware,
  linux: FcLinux,
};

interface Port {
  id: string;
  name?: string;
  position: Position;
  offset: number;
}

interface NetworkNodeProps {
  data: {
    label: string;
    type: keyof typeof deviceIcons;
    ports: Port[];
    showPorts: boolean;
  };
}

export const NetworkNode = memo(({ data }: NetworkNodeProps) => {
  const Icon = deviceIcons[data.type] || deviceIcons.default;

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border border-gray-200">
      {data.ports.map((port) => (
        <Handle
          key={port.id}
          id={port.id}
          type={port.position === Position.Top ? 'target' : 'source'}
          position={port.position}
          className={`!w-2 !h-2 !bg-bdazzled ${
            data.showPorts && port.name ? 'handle-with-label' : ''
          } ${port.position === Position.Top ? '' : 'bottom'}`}
          style={{ left: `${port.offset}%` }}
          data-label={port.name}
        />
      ))}
      <div className="flex items-center gap-2">
        <Icon className="w-8 h-8 text-bdazzled" />
        <span className="text-sm font-medium text-charcoal">{data.label}</span>
      </div>
    </div>
  );
});
