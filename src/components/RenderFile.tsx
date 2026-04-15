import { getFileType } from "@/utils/getFileType";

type RenderFileProps = {
    url: string;
    label?: string;
  };

export const RenderFile = ({ url, label }: RenderFileProps) => {
    const type = getFileType(url);

    if (type === "pdf") {
        return (
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-40 h-40 flex items-center justify-center bg-gray-100 rounded text-sm text-my-blue hover:underline"
            >
                📄 View {label}
            </a>
        );
    }

    return (
        <img
            src={url}
            className="w-full max-w-200 rounded object-cover"
            alt={label}
        />
    );
};