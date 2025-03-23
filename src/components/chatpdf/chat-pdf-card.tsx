import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Card, CardContent, CardTitle } from "../ui/card";

export interface chatPdf {
  id: string;
  name: string;
}

const ChatPdfCard = ({ data }: { data: chatPdf }) => {
  return (
    <Card className="hover:shadow-lg overflow-hidden">
      <CardContent>
        <CardTitle className="text-lg flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 tracking-tight mb-1">
          {data.name}
        </CardTitle>
        <Link href={`chatpdf/${data.id}`} className={buttonVariants()}>
          View
        </Link>
      </CardContent>
    </Card>
  );
};

export default ChatPdfCard;
