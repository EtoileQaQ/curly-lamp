"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Copy,
  Check,
  Pencil,
  Trash2,
  ImageIcon,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { setPostStatus, updatePost, deletePost } from "@/app/dashboard/actions";

export type Post = {
  id: string;
  title: string | null;
  content: string | null;
  status: string;
  created_at: string;
};

const STATUS: Record<string, { label: string; cls: string }> = {
  draft: { label: "Brouillon", cls: "bg-muted text-muted-foreground" },
  ready: { label: "Prêt", cls: "bg-emerald-100 text-emerald-700" },
  published: { label: "Publié", cls: "bg-primary/10 text-primary" },
};

function PostCard({ post }: { post: Post }) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.content ?? "");
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(post.content ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function changeStatus(status: string) {
    startTransition(() => setPostStatus(post.id, status));
  }

  function save() {
    startTransition(async () => {
      await updatePost(post.id, draft, post.status);
      setEditing(false);
    });
  }

  function remove() {
    if (!confirm("Supprimer définitivement ce post ?")) return;
    startTransition(() => deletePost(post.id));
  }

  const status = STATUS[post.status] ?? STATUS.draft;

  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl border border-border bg-background p-4 shadow-sm md:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-foreground">
            {post.title || "Sans titre"}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {new Date(post.created_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${status.cls}`}
        >
          {status.label}
        </span>
      </div>

      {editing ? (
        <div className="mt-4">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={10}
          />
          <div className="mt-3 grid gap-2 sm:flex">
            <Button
              size="sm"
              onClick={save}
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Enregistrer
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => {
                setDraft(post.content ?? "");
                setEditing(false);
              }}
            >
              <X className="h-4 w-4" />
              Annuler
            </Button>
          </div>
        </div>
      ) : (
        <p className="mt-3 line-clamp-4 whitespace-pre-wrap text-sm text-muted-foreground md:text-base">
          {post.content}
        </p>
      )}

      {!editing && (
        <div className="mt-4 grid min-w-0 grid-cols-1 gap-2 border-t border-border pt-4 sm:flex sm:flex-wrap sm:items-center">
          <Button
            size="sm"
            variant="outline"
            onClick={copy}
            className="w-full sm:w-auto"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" /> Copié !
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" /> Copier
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditing(true)}
            className="w-full sm:w-auto"
          >
            <Pencil className="h-4 w-4" /> Modifier
          </Button>

          <Button size="sm" variant="outline" asChild className="w-full sm:w-auto">
            <Link href={`/post/${post.id}`}>
              <ImageIcon className="h-4 w-4" /> Visuel
            </Link>
          </Button>

          <select
            value={post.status}
            onChange={(e) => changeStatus(e.target.value)}
            disabled={isPending}
            className="h-11 w-full rounded-md border border-input bg-background px-3 text-base sm:w-auto md:h-9 md:text-sm"
          >
            <option value="draft">Brouillon</option>
            <option value="ready">Prêt</option>
            <option value="published">Publié</option>
          </select>

          <Button
            size="sm"
            variant="ghost"
            onClick={remove}
            disabled={isPending}
            className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive sm:ml-auto sm:w-auto"
          >
            <Trash2 className="h-4 w-4" /> Supprimer
          </Button>
        </div>
      )}
    </div>
  );
}

export function DashboardPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="w-full max-w-full overflow-hidden rounded-2xl border border-dashed border-border bg-background p-6 text-center md:p-12">
        <p className="text-muted-foreground">
          Tu n&apos;as pas encore de post. Lance-toi !
        </p>
        <Button asChild className="mt-4 w-full sm:w-auto">
          <Link href="/ideas">Générer mes idées de posts</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid w-full max-w-full gap-4 overflow-hidden">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
