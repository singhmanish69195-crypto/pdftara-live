import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getToolById, getAllTools } from '@/config/tools';
import { getToolContent, type Locale } from '@/config/tool-content';
import { ToolPage } from '@/components/tools/ToolPage';
import { MergePDFTool } from '@/components/tools/merge';
import { SplitPDFTool } from '@/components/tools/split';
import { DeletePagesTool } from '@/components/tools/delete';
import { RotatePDFTool } from '@/components/tools/rotate';
import { AddBlankPageTool } from '@/components/tools/add-blank-page';
import { ReversePagesTool } from '@/components/tools/reverse';
import { NUpPDFTool } from '@/components/tools/n-up';
import { AlternateMergeTool } from '@/components/tools/alternate-merge';
import { DividePagesTool } from '@/components/tools/divide';
import { CombineSinglePageTool } from '@/components/tools/combine-single-page';
import { GridCombineTool } from '@/components/tools/grid-combine';
import { PosterizePDFTool } from '@/components/tools/posterize';
import { PDFMultiTool } from '@/components/tools/pdf-multi-tool';
import { AddAttachmentsTool } from '@/components/tools/add-attachments';
import { ExtractAttachmentsTool } from '@/components/tools/extract-attachments';
import { ExtractImagesTool } from '@/components/tools/extract-images';
import { EditAttachmentsTool } from '@/components/tools/edit-attachments';
import { ViewMetadataTool } from '@/components/tools/view-metadata';
import { EditMetadataTool } from '@/components/tools/edit-metadata';
import { PDFsToZipTool } from '@/components/tools/pdf-to-zip';
import { ComparePDFsTool } from '@/components/tools/compare-pdfs';
import { EditPDFTool } from '@/components/tools/edit-pdf';
import { ImageToPDFTool } from '@/components/tools/image-to-pdf';
import { TextToPDFTool } from '@/components/tools/text-to-pdf';
import { PSDToPDFTool } from '@/components/tools/psd-to-pdf';
import { JSONToPDFTool } from '@/components/tools/json-to-pdf';
import { FixPageSizeTool } from '@/components/tools/fix-page-size';
import { CompressPDFTool } from '@/components/tools/compress';
import { SignPDFTool } from '@/components/tools/sign';
import { CropPDFTool } from '@/components/tools/crop';
import { OrganizePDFTool } from '@/components/tools/organize';
import { ExtractPagesTool } from '@/components/tools/extract';
import { BookmarkTool } from '@/components/tools/bookmark';
import { PageNumbersTool } from '@/components/tools/page-numbers';
import { WatermarkTool } from '@/components/tools/watermark';
import { HeaderFooterTool } from '@/components/tools/header-footer';
import { InvertColorsTool } from '@/components/tools/invert-colors';
import { BackgroundColorTool } from '@/components/tools/background-color';
import { StampsTool } from '@/components/tools/stamps';
import { RemoveAnnotationsTool } from '@/components/tools/remove-annotations';
import { FormFillerTool } from '@/components/tools/form-filler';
import { FormCreatorTool } from '@/components/tools/form-creator';
import { RemoveBlankPagesTool } from '@/components/tools/remove-blank-pages';
import { PDFToImageTool } from '@/components/tools/pdf-to-image';
import { PDFToGreyscaleTool } from '@/components/tools/pdf-to-greyscale';
import { PDFToJSONTool } from '@/components/tools/pdf-to-json';
import { OCRPDFTool } from '@/components/tools/ocr';
import { LinearizePDFTool } from '@/components/tools/linearize';
import { PageDimensionsTool } from '@/components/tools/page-dimensions';
import { RemoveRestrictionsTool } from '@/components/tools/remove-restrictions';
import { EncryptPDFTool } from '@/components/tools/encrypt';
import { DecryptPDFTool } from '@/components/tools/decrypt';
import { SanitizePDFTool } from '@/components/tools/sanitize';
import { FlattenPDFTool } from '@/components/tools/flatten';
import { RemoveMetadataTool } from '@/components/tools/remove-metadata';
import { ChangePermissionsTool } from '@/components/tools/change-permissions';
import { RepairPDFTool } from '@/components/tools/repair';
import { TableOfContentsTool } from '@/components/tools/table-of-contents';
import { TextColorTool } from '@/components/tools/text-color';
import { PDFToDocxTool } from '@/components/tools/pdf-to-docx';
import { PDFToPptxTool } from '@/components/tools/pdf-to-pptx';
import { PDFToExcelTool } from '@/components/tools/pdf-to-excel';
import { RotateCustomTool } from '@/components/tools/rotate-custom/RotateCustomTool';
import { WordToPDFTool } from '@/components/tools/word-to-pdf';
import { ExcelToPDFTool } from '@/components/tools/excel-to-pdf';
import { PPTXToPDFTool } from '@/components/tools/pptx-to-pdf';
import { XPSToPDFTool } from '@/components/tools/xps-to-pdf';
import { RTFToPDFTool } from '@/components/tools/rtf-to-pdf';
import { EPUBToPDFTool } from '@/components/tools/epub-to-pdf';
import { MOBIToPDFTool } from '@/components/tools/mobi-to-pdf';
import { FB2ToPDFTool } from '@/components/tools/fb2-to-pdf';
import { PDFToSVGTool } from '@/components/tools/pdf-to-svg';
import { generateToolMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import {
  generateSoftwareApplicationSchema,
  generateFAQPageSchema,
  generateHowToSchema,
  generateWebPageSchema,
  generateBreadcrumbSchema
} from '@/lib/seo/structured-data';
import type { Metadata } from 'next';

const SUPPORTED_LOCALES: Locale[] = ['en', 'ja', 'ko', 'es', 'fr', 'de', 'zh', 'pt'];

interface ToolPageParams {
  params: Promise<{
    locale: string;
    tool: string;
  }>;
}

export async function generateStaticParams() {
  const tools = getAllTools();
  return SUPPORTED_LOCALES.flatMap(locale =>
    tools.map(tool => ({
      locale,
      tool: tool.slug,
    }))
  );
}

// --- SEO JUGAD START: Dynamic Title & Description Engine ---
export async function generateMetadata({ params }: ToolPageParams): Promise<Metadata> {
  const { locale: localeParam, tool: toolSlug } = await params;
  const locale = localeParam as Locale;
  const tool = getToolById(toolSlug);
  const content = getToolContent(locale, tool?.id || '');

  if (!tool || !content) return { title: 'PDF Tool | PDFTara' };

  // Har Language ke liye Clickable "Power Phrases"
  const seoMap: Record<string, { suffix: string; desc: string }> = {
    en: { suffix: 'Free Online (2026) - No Signup', desc: 'Use our [TOOL] online for free. 100% Secure, fast, and no registration required. Your files stay private.' },
    ja: { suffix: '無料オンライン (2026) - 登録不要', desc: '[TOOL]をオンラインで無料で利用。100%安全、高速、登録不要。ファイルは非公開のままです。' },
    ko: { suffix: '무료 온라인 (2026) - 가입 없음', desc: '[TOOL]을 온라인에서 무료로 사용하세요. 100% 보안, 신속, 가입 불필요. 파일은 비공개로 유지됩니다.' },
    es: { suffix: 'Gratis en línea (2026) - Sin registro', desc: 'Usa nuestro [TOOL] en línea gratis. 100% seguro, rápido y sin registro. Tus archivos son privados.' },
    fr: { suffix: 'Gratuit en ligne (2026) - Sans inscription', desc: 'Utilisez notre [TOOL] en ligne gratuitement. 100% sécurisé, rapide et sans inscription.' },
    de: { suffix: 'Kostenlos Online (2026) - Ohne Anmeldung', desc: 'Nutzen Sie unser [TOOL] online kostenlos. 100% sicher, schnell und ohne Anmeldung.' },
    zh: { suffix: '免费在线 (2026) - 无需注册', desc: '免费在线使用我们的[TOOL]。100%安全、快速、无需注册。您的文件保持私密。' },
    pt: { suffix: 'Grátis Online (2026) - Sem Registro', desc: 'Use nosso [TOOL] online gratuitamente. 100% seguro, rápido e sem registro.' },
  };

  const currentSeo = seoMap[locale] || seoMap['en'];
  const finalTitle = `${content.title} ${currentSeo.suffix} | PDFTara`;
  const finalDesc = currentSeo.desc.replace('[TOOL]', content.title);

  const baseMetadata = await generateToolMetadata({
    tool,
    content,
    locale,
    path: `/tools/${toolSlug}`,
  });

  return {
    ...baseMetadata,
    title: finalTitle,
    description: finalDesc,
    // Hreflang Tags: Sabse zaroori ranking ke liye
    alternates: {
      canonical: `https://www.pdftara.com/${locale}/tools/${toolSlug}`,
      languages: SUPPORTED_LOCALES.reduce((acc, l) => {
        acc[l] = `https://www.pdftara.com/${l}/tools/${toolSlug}`;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}
// --- SEO JUGAD END ---

export default async function ToolPageRoute({ params }: ToolPageParams) {
  const { locale: localeParam, tool: toolSlug } = await params;
  const locale = localeParam as Locale;

  setRequestLocale(locale);
  const t = await getTranslations();
  const tool = getToolById(toolSlug);

  if (!tool) notFound();
  const content = getToolContent(locale, tool.id);
  if (!content) notFound();

  // 1. GENERATE ALL SCHEMAS (Fixed for Google Search Console errors)
  const toolSchema = generateSoftwareApplicationSchema(tool, content, locale);
  const fixedToolSchema = {
    ...toolSchema,
    "operatingSystem": "Windows, macOS, Linux, Android, iOS",
    "applicationCategory": "UtilitiesApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const faqSchema = content.faq && content.faq.length > 0 ? generateFAQPageSchema(content.faq) : null;
  const howToSchema = generateHowToSchema(tool, content, locale);
  const webPageSchema = generateWebPageSchema(tool, content, locale);
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', path: '' },
      { name: 'Tools', path: '/tools' },
      { name: content.title, path: `/tools/${tool.slug}` },
    ],
    locale
  );

  const allSchemas: object[] = [fixedToolSchema, webPageSchema, breadcrumbSchema];
  if (faqSchema) allSchemas.push(faqSchema);
  if (howToSchema) allSchemas.push(howToSchema);

  const localizedRelatedTools = tool.relatedTools.reduce((acc, relatedId) => {
    const relatedContent = getToolContent(locale, relatedId);
    if (relatedContent) {
      acc[relatedId] = {
        title: relatedContent.title,
        description: relatedContent.metaDescription
      };
    }
    return acc;
  }, {} as Record<string, { title: string; description: string }>);

  const renderToolInterface = () => {
    switch (tool.id) {
      case 'merge-pdf': return <MergePDFTool />;
      case 'split-pdf': return <SplitPDFTool />;
      case 'delete-pages': return <DeletePagesTool />;
      case 'rotate-pdf': return <RotatePDFTool />;
      case 'rotate-custom': return <RotateCustomTool />;
      case 'add-blank-page': return <AddBlankPageTool />;
      case 'reverse-pages': return <ReversePagesTool />;
      case 'n-up-pdf': return <NUpPDFTool />;
      case 'grid-combine': return <GridCombineTool />;
      case 'alternate-merge': return <AlternateMergeTool />;
      case 'divide-pages': return <DividePagesTool />;
      case 'combine-single-page': return <CombineSinglePageTool />;
      case 'posterize-pdf': return <PosterizePDFTool />;
      case 'pdf-multi-tool': return <PDFMultiTool />;
      case 'add-attachments': return <AddAttachmentsTool />;
      case 'extract-attachments': return <ExtractAttachmentsTool />;
      case 'extract-images': return <ExtractImagesTool />;
      case 'edit-attachments': return <EditAttachmentsTool />;
      case 'view-metadata': return <ViewMetadataTool />;
      case 'edit-metadata': return <EditMetadataTool />;
      case 'pdf-to-zip': return <PDFsToZipTool />;
      case 'compare-pdfs': return <ComparePDFsTool />;
      case 'edit-pdf': return <EditPDFTool />;
      case 'image-to-pdf': return <ImageToPDFTool />;
      case 'jpg-to-pdf': return <ImageToPDFTool imageType="jpg" />;
      case 'png-to-pdf': return <ImageToPDFTool imageType="png" />;
      case 'webp-to-pdf': return <ImageToPDFTool imageType="webp" />;
      case 'bmp-to-pdf': return <ImageToPDFTool imageType="bmp" />;
      case 'tiff-to-pdf': return <ImageToPDFTool imageType="tiff" />;
      case 'svg-to-pdf': return <ImageToPDFTool imageType="svg" />;
      case 'heic-to-pdf': return <ImageToPDFTool imageType="heic" />;
      case 'psd-to-pdf': return <PSDToPDFTool />;
      case 'txt-to-pdf': return <TextToPDFTool />;
      case 'json-to-pdf': return <JSONToPDFTool />;
      case 'compress-pdf': return <CompressPDFTool />;
      case 'sign-pdf': return <SignPDFTool />;
      case 'crop-pdf': return <CropPDFTool />;
      case 'fix-page-size': return <FixPageSizeTool />;
      case 'organize-pdf': return <OrganizePDFTool />;
      case 'extract-pages': return <ExtractPagesTool />;
      case 'bookmark': return <BookmarkTool />;
      case 'page-numbers': return <PageNumbersTool />;
      case 'add-watermark': return <WatermarkTool />;
      case 'header-footer': return <HeaderFooterTool />;
      case 'invert-colors': return <InvertColorsTool />;
      case 'background-color': return <BackgroundColorTool />;
      case 'text-color': return <TextColorTool />;
      case 'table-of-contents': return <TableOfContentsTool />;
      case 'add-stamps': return <StampsTool />;
      case 'remove-annotations': return <RemoveAnnotationsTool />;
      case 'form-filler': return <FormFillerTool />;
      case 'form-creator': return <FormCreatorTool />;
      case 'remove-blank-pages': return <RemoveBlankPagesTool />;
      case 'pdf-to-jpg': return <PDFToImageTool outputFormat="jpg" />;
      case 'pdf-to-png': return <PDFToImageTool outputFormat="png" />;
      case 'pdf-to-webp': return <PDFToImageTool outputFormat="webp" />;
      case 'pdf-to-bmp': return <PDFToImageTool outputFormat="bmp" />;
      case 'pdf-to-tiff': return <PDFToImageTool outputFormat="tiff" />;
      case 'pdf-to-svg': return <PDFToSVGTool />;
      case 'pdf-to-greyscale': return <PDFToGreyscaleTool />;
      case 'pdf-to-json': return <PDFToJSONTool />;
      case 'pdf-to-docx': return <PDFToDocxTool />;
      case 'pdf-to-pptx': return <PDFToPptxTool />;
      case 'pdf-to-excel': return <PDFToExcelTool />;
      case 'ocr-pdf': return <OCRPDFTool />;
      case 'linearize-pdf': return <LinearizePDFTool />;
      case 'page-dimensions': return <PageDimensionsTool />;
      case 'remove-restrictions': return <RemoveRestrictionsTool />;
      case 'repair-pdf': return <RepairPDFTool />;
      case 'encrypt-pdf': return <EncryptPDFTool />;
      case 'decrypt-pdf': return <DecryptPDFTool />;
      case 'sanitize-pdf': return <SanitizePDFTool />;
      case 'flatten-pdf': return <FlattenPDFTool />;
      case 'remove-metadata': return <RemoveMetadataTool />;
      case 'change-permissions': return <ChangePermissionsTool />;
      case 'word-to-pdf': return <WordToPDFTool />;
      case 'excel-to-pdf': return <ExcelToPDFTool />;
      case 'pptx-to-pdf': return <PPTXToPDFTool />;
      case 'xps-to-pdf': return <XPSToPDFTool />;
      case 'rtf-to-pdf': return <RTFToPDFTool />;
      case 'epub-to-pdf': return <EPUBToPDFTool />;
      case 'mobi-to-pdf': return <MOBIToPDFTool />;
      case 'fb2-to-pdf': return <FB2ToPDFTool />;
      default:
        return <div className="p-8 text-center text-muted-foreground"><p>{t('tools.comingSoon')}</p></div>;
    }
  };

  return (
    <>
      <JsonLd data={allSchemas} />
      <ToolPage
        tool={tool}
        content={content}
        locale={locale}
        localizedRelatedTools={localizedRelatedTools}
      >
        {renderToolInterface()}
      </ToolPage>
    </>
  );
}