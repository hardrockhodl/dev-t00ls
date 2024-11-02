import {
    IconButton,
    SpeedDial,
    SpeedDialHandler,
    SpeedDialContent,
    SpeedDialAction,
  } from "@material-tailwind/react";
  import {
    PlusIcon,
    HomeIcon,
    CogIcon,
    Square3Stack3DIcon,
  } from "@heroicons/react/24/outline";
   
  export function DefaultSpeedDial() {
    return (
      <div className="relative h-80 w-full">
        <div className="absolute top-0 right-0">
          <SpeedDial>
            <SpeedDialHandler>
              <IconButton size="lg" className="rounded-full" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <PlusIcon className="h-5 w-5 transition-transform group-hover:rotate-45" />
              </IconButton>
            </SpeedDialHandler>
            <SpeedDialContent placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
              <SpeedDialAction placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <HomeIcon className="h-5 w-5" />
              </SpeedDialAction>
              <SpeedDialAction placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <CogIcon className="h-5 w-5" />
              </SpeedDialAction>
              <SpeedDialAction placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                <Square3Stack3DIcon className="h-5 w-5" />
              </SpeedDialAction>
            </SpeedDialContent>
          </SpeedDial>
        </div>
      </div>
    );
  }