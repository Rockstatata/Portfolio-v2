import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { collections, isCollectionKey } from "@/lib/admin/collections";
import { listItems } from "@/lib/admin/queries";
import { PageHeader } from "@/components/admin/page-header";
import { ItemList } from "@/components/admin/item-list";
import { SavedToast } from "@/components/admin/saved-toast";

export default async function CollectionPage({
  params,
}: PageProps<"/admin/[collection]">) {
  const { collection: key } = await params;
  if (!isCollectionKey(key)) notFound();
  const collection = collections[key];
  const items = await listItems(key);

  return (
    <>
      <Suspense>
        <SavedToast />
      </Suspense>
      <PageHeader
        title={collection.label}
        description={`${collection.description} Drag to reorder; the order here is the order on the site.`}
        action={
          <Link
            href={`/admin/${key}/new`}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-void transition hover:bg-plasma"
          >
            <Plus className="size-4" /> New {collection.singular.toLowerCase()}
          </Link>
        }
      />
      <ItemList
        collectionKey={key}
        items={items.map((item) => ({
          id: item.id,
          visible: item.visible,
          title: String(item[collection.titleField] ?? ""),
          subtitle: String(item[collection.subtitleField] ?? ""),
          featured: item.featured === true,
        }))}
      />
    </>
  );
}
