import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegacyMain } from "@/components/LegacyMain";
import { getLegacyPage, getLegacySlugs } from "@/lib/legacy";
type PageProps={params:Promise<{slug:string}>};
export function generateStaticParams(){return getLegacySlugs().map(slug=>({slug}))}
export async function generateMetadata({params}:PageProps):Promise<Metadata>{const {slug}=await params;try{const p=getLegacyPage(slug);return {title:p.title,description:p.description||undefined}}catch{return {}}}
export default async function LegacyPage({params}:PageProps){const {slug}=await params;try{return <LegacyMain html={getLegacyPage(slug).mainHtml}/>}catch{notFound()}}
