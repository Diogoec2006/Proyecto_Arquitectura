import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

export default function DateTooltip({ children, text }: { children: React.ReactNode, text: string }) {
    return (
        <Tooltip>
            <TooltipTrigger>
                {children}
            </TooltipTrigger>
            <TooltipContent>
                <p>{text}</p>
            </TooltipContent>
        </Tooltip>
    )
}