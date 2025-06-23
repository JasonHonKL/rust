
interface UserMessageProps {
  content: string;
}

export const UserMessage = ({ content }: UserMessageProps) => {
  return (
    <div className="whitespace-pre-wrap break-words text-base leading-relaxed">
      {content}
    </div>
  );
};
