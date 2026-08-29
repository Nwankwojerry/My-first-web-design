type LegacyMainProps = { html: string };
export function LegacyMain({ html }: LegacyMainProps) { return <main dangerouslySetInnerHTML={{ __html: html }} />; }
