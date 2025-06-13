type Task = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    status: TaskStatus;
    description: string;
    staffId: number;
    completedAt: Date | null;
    dueDate: Date;
}

type TaskStatus = "COMPLETED" | "PENDING" | "IN_PROGRESS"