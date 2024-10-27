import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import {
  MdOutlineRouter,
  MdDeviceHub,
  MdOutlineMarkunreadMailbox,
  MdLaptopMac,
  MdOutlineShield,
  MdQuestionMark,
  MdDesktopWindows,
  MdLanguage,
} from 'react-icons/md'; // Material Icons (for routers)

const deviceIcons = {
  router: MdOutlineRouter,
  switch: MdDeviceHub,
  firewall: MdOutlineShield,
  server: MdOutlineMarkunreadMailbox,
  clientmac: MdLaptopMac,
  clientwin: MdDesktopWindows,
  cloud: MdLanguage,
  default: MdQuestionMark,
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
