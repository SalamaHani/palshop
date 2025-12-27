import React from "react";
import { Separator } from "../ui/separator";

function TitelSection({ text }: { text: string }) {
  return (
    <div>
      <h2 className="text-3xl font-medium tracking-wider capitalize mb-2">
        {text}
      </h2>
      <Separator />
    </div>
  );
}

export default TitelSection;
