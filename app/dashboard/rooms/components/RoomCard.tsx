import { Button } from "@heroui/button";
import {
  Card,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  addToast,
  Chip,
  Tooltip,
} from "@heroui/react";
import { BedDouble, BedSingle, MoreVertical } from "lucide-react";

export const RoomCard = ({ room }: { room: Room }) => {
  const statusMap: Record<
    string,
    {
      label: string;
      variant: "shadow" | "solid" | "flat" | "faded";
      color: "success" | "warning" | "danger" | "default";
    }
  > = {
    AVAILABLE: { label: "Disponível", variant: "solid", color: "success" },
    OCCUPIED: { label: "Ocupado", variant: "faded", color: "warning" },
    MAINTENANCE: { label: "Manutenção", variant: "flat", color: "danger" },
  };

  const renderQtzBeds = (room: Room) => {
    const hasDoubleBeds = room.doubleBeds > 0;
    const hasSingleBeds = room.singleBeds > 0;

    return (
      <div className="gap-2 flex flex-row items-center">
        <p>{room.doubleBeds}</p>
        {hasDoubleBeds && (
          <Tooltip content="Camas de casal">
            <BedDouble color="white" size={16} />
          </Tooltip>
        )}
        <p>{room.singleBeds}</p>
        {hasSingleBeds && (
          <Tooltip content="Camas de solteiro">
            <BedSingle color="white" size={16} />
          </Tooltip>
        )}
      </div>
    );
  };

  return (
    <Card key={room.id} className="relative p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Quarto {room.number}</h3>
        <Dropdown>
          <DropdownTrigger>
            <Button className="w-3 h-8" variant="ghost">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem
              key="edit"
              onClick={() => {
                addToast({
                  title: "Editar",
                  description: "Editar quarto não implementado",
                  color: "warning",
                });
              }}
            >
              Editar
            </DropdownItem>
            <DropdownItem
              key="delete"
              className="text-red-500"
              onClick={() => {
                addToast({
                  title: "Excluir",
                  description: "Excluir quarto não implementado",
                  color: "danger",
                });
              }}
            >
              Excluir
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="text-sm text-zinc-500">Capacidade: {room.capacity}</div>
      <div className="flex items-center justify-between">
        <Chip
          color={statusMap[room.status]?.color || "default"}
          variant={statusMap[room.status]?.variant}
        >
          {statusMap[room.status]?.label || "Desconhecido"}
        </Chip>
        {renderQtzBeds(room)}
      </div>
    </Card>
  );
};
