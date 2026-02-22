import { ChatContainer } from "@/components/chat/ChatContainer";
import { MessageBubble } from "@/components/chat/message-bubble";
import { Message } from "@/types/message";
import { div } from "motion/react-client";
// import { ComponentExample } from "@/components/component-example";

const fakeMessages: Message[] = [
  {
    id: "1",
    role: "user",
    text: "Olá, estou procurando por um anel solitário em ouro amarelo ou branco com diamantes para um pedido de casamento. Quero opções que custem até cinco mil reais.",
    createdAt: new Date(),
  },
  {
    id: "2",
    role: "assistant",
    text: "Claro, aqui estão algumas sugestões de anéis solitário com as características e dentro do valor que você solicitou ",
    createdAt: new Date(),
  },
];

export default function Page() {
  return (
    <div className="h-screen w-full flex items-center ">
        <ChatContainer/>
    </div>
  );
}
