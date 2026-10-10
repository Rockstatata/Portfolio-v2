import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { collections, isCollectionKey } from "@/lib/admin/collections";
import { getItem } from "@/lib/admin/queries";
import { PageHeader } from "@/components/admin/page-header";
import { ItemForm } from "@/components/admin/item-form";

export default async function EditItemPage({
  params,
}: PageProps<"/admin/[collection]/[id]">) {
  const { collection: key, id: rawId } = await params;
  if (!isCollectionKey(key)) notFound();
  const collection = collections[key];

  const isNew = rawId === "new";
  const id = isNew ? null : Number(rawId);
  if (!isNew && !Number.isInteger(id)) notFound();
  const item = id ? await getItem(key, id) : null;
  if (!isNew && !item) notFound();

  return (
    <>
      <Link
        href={`/admin/${key}`}
        className="hud-label mb-6 inline-flex items-center gap-2 hover:text-white"
      >
        <ArrowLeft className="size-3.5" /> {collection.label}
      </Link>
      <PageHeader
        title={
          isNew
            ? `New ${collection.singular.toLowerCase()}`
            : String(item?.[collection.titleField] ?? "Edit")
        }
      />
      <ItemForm
        collectionKey={key}
        id={id}
        fields={collection.fields}
        initial={item ?? { visible: true }}
      />
    </>
  );
}
