import { CreateChatPDFForm } from "@/components/chatpdf/create-chatpdf-form";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { get } from "http";

const CreateChatPDFPage = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div>
      <CreateChatPDFForm userId={user.id} />
    </div>
  );
};

export default CreateChatPDFPage;
