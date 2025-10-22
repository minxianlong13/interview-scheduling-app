import { InterviewsList } from "@/components/interviews-list";
import { Interview } from "@/lib/types";
import React from "react";

function InterviewPanel({
  interviews,
  onDelete,
}: Readonly<{ interviews: Interview[]; onDelete: (id: string) => void }>) {
  return (
    <div>
      <InterviewsList interviews={interviews} onDelete={onDelete} />
    </div>
  );
}

export default InterviewPanel;
