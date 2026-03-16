import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { VpnPost } from "@/data/vpn-posts";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";
import MDEditor, { commands, ICommand } from "@uiw/react-md-editor";
import {
  useVpnPosts,
  useVpnPost,
  useCreateVpnPost,
  useUpdateVpnPost,
  useDeleteVpnPost,
} from "@/hooks/useVpnPosts";

// ==================== РљР°СЃС‚РѕРјРЅС‹Рµ РєРѕРјР°РЅРґС‹ СЂРµРґР°РєС‚РѕСЂР° ====================

const alignLeftCommand: ICommand = {
  name: "alignLeft",
  keyCommand: "alignLeft",
  buttonProps: { "aria-label": "Р’С‹СЂРѕРІРЅСЏС‚СЊ РїРѕ Р»РµРІРѕРјСѓ РєСЂР°СЋ" },
  icon: (
    <svg width="14" height="14" viewBox="0 0 20 20">
      <path d="M17 5H3V3h14v2zm0 4H3v2h14V9zM3 15h10v-2H3v2z" fill="currentColor" />
    </svg>
  ),
  execute: (state, api) => {
    api.replaceSelection(`<p align="left">${state.selectedText || "С‚РµРєСЃС‚"}</p>`);
  },
};

const alignCenterCommand: ICommand = {
  name: "alignCenter",
  keyCommand: "alignCenter",
  buttonProps: { "aria-label": "Р’С‹СЂРѕРІРЅСЏС‚СЊ РїРѕ С†РµРЅС‚СЂСѓ" },
  icon: (
    <svg width="14" height="14" viewBox="0 0 20 20">
      <path d="M17 5H3V3h14v2zm-2 4H5v2h10V9zM3 15h14v-2H3v2z" fill="currentColor" />
    </svg>
  ),
  execute: (state, api) => {
    api.replaceSelection(`<p align="center">${state.selectedText || "С‚РµРєСЃС‚"}</p>`);
  },
};

const alignRightCommand: ICommand = {
  name: "alignRight",
  keyCommand: "alignRight",
  buttonProps: { "aria-label": "Р’С‹СЂРѕРІРЅСЏС‚СЊ РїРѕ РїСЂР°РІРѕРјСѓ РєСЂР°СЋ" },
  icon: (
    <svg width="14" height="14" viewBox="0 0 20 20">
      <path d="M17 5H3V3h14v2zm0 4H7v2h10V9zM3 15h14v-2H3v2z" fill="currentColor" />
    </svg>
  ),
  execute: (state, api) => {
    api.replaceSelection(`<p align="right">${state.selectedText || "С‚РµРєСЃС‚"}</p>`);
  },
};

const alignJustifyCommand: ICommand = {
  name: "alignJustify",
  keyCommand: "alignJustify",
  buttonProps: { "aria-label": "Р’С‹СЂРѕРІРЅСЏС‚СЊ РїРѕ С€РёСЂРёРЅРµ" },
  icon: (
    <svg width="14" height="14" viewBox="0 0 20 20">
      <path d="M17 5H3V3h14v2zm0 4H3v2h14V9zM3 15h14v-2H3v2z" fill="currentColor" />
    </svg>
  ),
  execute: (state, api) => {
    api.replaceSelection(`<p style="text-align: justify;">${state.selectedText || "С‚РµРєСЃС‚"}</p>`);
  },
};

const fontSizeIncreaseCommand: ICommand = {
  name: "fontSizeIncrease",
  keyCommand: "fontSizeIncrease",
  buttonProps: { "aria-label": "РЈРІРµР»РёС‡РёС‚СЊ С€СЂРёС„С‚" },
  icon: <svg width="14" height="14" viewBox="0 0 20 20"><text x="5" y="15" fontSize="14" fill="currentColor">A+</text></svg>,
  execute: (state, api) => {
    api.replaceSelection(`<font size="5">${state.selectedText || "С‚РµРєСЃС‚"}</font>`);
  },
};

const fontSizeDecreaseCommand: ICommand = {
  name: "fontSizeDecrease",
  keyCommand: "fontSizeDecrease",
  buttonProps: { "aria-label": "РЈРјРµРЅСЊС€РёС‚СЊ С€СЂРёС„С‚" },
  icon: <svg width="14" height="14" viewBox="0 0 20 20"><text x="5" y="15" fontSize="14" fill="currentColor">A-</text></svg>,
  execute: (state, api) => {
    api.replaceSelection(`<font size="2">${state.selectedText || "С‚РµРєСЃС‚"}</font>`);
  },
};

const fontStemCommand: ICommand = {
  name: "fontStem",
  keyCommand: "fontStem",
  buttonProps: { "aria-label": "РЁСЂРёС„С‚ Stem" },
  icon: <span style={{ fontSize: 12 }}>Stem</span>,
  execute: (state, api) => {
    api.replaceSelection(`<span style="font-family: 'Stem', sans-serif;">${state.selectedText || "С‚РµРєСЃС‚"}</span>`);
  },
};

const fontTTCommand: ICommand = {
  name: "fontTT",
  keyCommand: "fontTT",
  buttonProps: { "aria-label": "РЁСЂРёС„С‚ TT Travels" },
  icon: <span style={{ fontSize: 12 }}>TT</span>,
  execute: (state, api) => {
    api.replaceSelection(`<span style="font-family: 'TT Travels Next Trial', sans-serif;">${state.selectedText || "С‚РµРєСЃС‚"}</span>`);
  },
};

const colorOrangeCommand: ICommand = {
  name: "colorOrange",
  keyCommand: "colorOrange",
  buttonProps: { "aria-label": "РћСЂР°РЅР¶РµРІС‹Р№ (#FF931F)" },
  icon: <div style={{ width: 14, height: 14, backgroundColor: "#FF931F", borderRadius: 2 }} />,
  execute: (state, api) => {
    api.replaceSelection(`<span class="text-[#FF931F] dark:text-[#FF931F]">${state.selectedText || "С‚РµРєСЃС‚"}</span>`);
  },
};

const colorDarkCommand: ICommand = {
  name: "colorDark",
  keyCommand: "colorDark",
  buttonProps: { "aria-label": "РўС‘РјРЅС‹Р№ (#272932)" },
  icon: <div style={{ width: 14, height: 14, backgroundColor: "#272932", borderRadius: 2 }} />,
  execute: (state, api) => {
    api.replaceSelection(`<span class="text-[#272932] dark:text-white">${state.selectedText || "С‚РµРєСЃС‚"}</span>`);
  },
};

const colorDark50Command: ICommand = {
  name: "colorDark50",
  keyCommand: "colorDark50",
  buttonProps: { "aria-label": "РўС‘РјРЅС‹Р№ 50%" },
  icon: <div style={{ width: 14, height: 14, backgroundColor: "rgba(39, 41, 50, 0.5)", borderRadius: 2 }} />,
  execute: (state, api) => {
    api.replaceSelection(`<span class="text-[#272932]/50 dark:text-white/50">${state.selectedText || "С‚РµРєСЃС‚"}</span>`);
  },
};

const heading1AdaptiveCommand: ICommand = {
  name: "heading1Adaptive",
  keyCommand: "heading1Adaptive",
  buttonProps: { "aria-label": "Р—Р°РіРѕР»РѕРІРѕРє СЂР°Р·РґРµР»Р° (Р°РґР°РїС‚РёРІРЅС‹Р№)" },
  icon: <span style={{ fontSize: 12 }}>H1</span>,
  execute: (state, api) => {
    const text = state.selectedText || "Р—Р°РіРѕР»РѕРІРѕРє СЂР°Р·РґРµР»Р°";
    api.replaceSelection(`<span class="font-heading font-bold text-2xl md:text-3xl lg:text-4xl text-[#272932] dark:text-white text-left block">${text}</span>`);
  },
};

const body1AdaptiveCommand: ICommand = {
  name: "body1Adaptive",
  keyCommand: "body1Adaptive",
  buttonProps: { "aria-label": "РўРµРєСЃС‚ 1 (Stem Medium, Р°РґР°РїС‚РёРІРЅС‹Р№)" },
  icon: <span style={{ fontSize: 12 }}>T1</span>,
  execute: (state, api) => {
    const text = state.selectedText || "РўРµРєСЃС‚ 1";
    api.replaceSelection(`<span class="font-sans font-medium text-base md:text-lg text-[#272932] dark:text-white text-justify block indent-8">${text}</span>`);
  },
};

const body2AdaptiveCommand: ICommand = {
  name: "body2Adaptive",
  keyCommand: "body2Adaptive",
  buttonProps: { "aria-label": "РўРµРєСЃС‚ 2 (Stem Regular, Р°РґР°РїС‚РёРІРЅС‹Р№)" },
  icon: <span style={{ fontSize: 12 }}>T2</span>,
  execute: (state, api) => {
    const text = state.selectedText || "РўРµРєСЃС‚ 2";
    api.replaceSelection(`<span class="font-sans font-normal text-base md:text-lg text-[#272932] dark:text-white text-justify block indent-8">${text}</span>`);
  },
};

const metaHeading1AdaptiveCommand: ICommand = {
  name: "metaHeading1Adaptive",
  keyCommand: "metaHeading1Adaptive",
  buttonProps: { "aria-label": "Р—Р°РіРѕР»РѕРІРѕРє H1 (Р°РґР°РїС‚РёРІРЅС‹Р№)" },
  icon: <span style={{ fontSize: 12 }}>H1</span>,
  execute: (state, api) => {
    const text = state.selectedText || "Р—Р°РіРѕР»РѕРІРѕРє";
    api.replaceSelection(`<span class="font-heading font-bold text-4xl md:text-5xl lg:text-6xl text-[#272932] dark:text-white text-left block">${text}</span>`);
  },
};

const metaText1AdaptiveCommand: ICommand = {
  name: "metaText1Adaptive",
  keyCommand: "metaText1Adaptive",
  buttonProps: { "aria-label": "РўРµРєСЃС‚ T1 (Р°РґР°РїС‚РёРІРЅС‹Р№)" },
  icon: <span style={{ fontSize: 12 }}>T1</span>,
  execute: (state, api) => {
    const text = state.selectedText || "РўРµРєСЃС‚";
    api.replaceSelection(`<span class="font-sans font-medium text-xl md:text-2xl text-[#272932] dark:text-white text-left block">${text}</span>`);
  },
};

const createListItem = (content: string) =>
  `<li class="font-sans font-normal text-base md:text-lg leading-tight text-[#272932] dark:text-white text-justify">${content}</li>`;

const numberedListCommand: ICommand = {
  name: "numberedList",
  keyCommand: "numberedList",
  buttonProps: { "aria-label": "РќСѓРјРµСЂРѕРІР°РЅРЅС‹Р№ СЃРїРёСЃРѕРє" },
  icon: <span style={{ fontSize: 12 }}>1.</span>,
  execute: (state, api) => {
    const lines = (state.selectedText || "Р­Р»РµРјРµРЅС‚ СЃРїРёСЃРєР°").split("\n").filter(Boolean);
    api.replaceSelection(`<ol class="list-decimal pl-5 space-y-1">${lines.map(createListItem).join("")}</ol>`);
  },
};

const discListCommand: ICommand = {
  name: "discList",
  keyCommand: "discList",
  buttonProps: { "aria-label": "РњР°СЂРєРёСЂРѕРІР°РЅРЅС‹Р№ СЃРїРёСЃРѕРє (РєСЂСѓРіРё)" },
  icon: <span style={{ fontSize: 12 }}>вЂў</span>,
  execute: (state, api) => {
    const lines = (state.selectedText || "Р­Р»РµРјРµРЅС‚ СЃРїРёСЃРєР°").split("\n").filter(Boolean);
    api.replaceSelection(`<ul class="list-disc pl-5 space-y-1">${lines.map(createListItem).join("")}</ul>`);
  },
};

const squareListCommand: ICommand = {
  name: "squareList",
  keyCommand: "squareList",
  buttonProps: { "aria-label": "РњР°СЂРєРёСЂРѕРІР°РЅРЅС‹Р№ СЃРїРёСЃРѕРє (РєРІР°РґСЂР°С‚С‹)" },
  icon: <span style={{ fontSize: 12 }}>в– </span>,
  execute: (state, api) => {
    const lines = (state.selectedText || "Р­Р»РµРјРµРЅС‚ СЃРїРёСЃРєР°").split("\n").filter(Boolean);
    api.replaceSelection(`<ul class="list-square pl-5 space-y-1">${lines.map(createListItem).join("")}</ul>`);
  },
};

const checkListCommand: ICommand = {
  name: "checkList",
  keyCommand: "checkList",
  buttonProps: { "aria-label": "РЎРїРёСЃРѕРє СЃ РіР°Р»РѕС‡РєР°РјРё" },
  icon: <span style={{ fontSize: 12 }}>вњ“</span>,
  execute: (state, api) => {
    const lines = (state.selectedText || "Р­Р»РµРјРµРЅС‚ СЃРїРёСЃРєР°").split("\n").filter(Boolean);
    const items = lines
      .map((line) => `<li class="font-sans font-normal text-base md:text-lg leading-tight text-[#272932] dark:text-white text-justify list-none pl-5 relative before:content-['вњ“'] before:absolute before:left-0">${line}</li>`)
      .join("");
    api.replaceSelection(`<ul class="space-y-1">${items}</ul>`);
  },
};

const clearFormattingCommand: ICommand = {
  name: "clearFormatting",
  keyCommand: "clearFormatting",
  buttonProps: { "aria-label": "РћС‡РёСЃС‚РёС‚СЊ С„РѕСЂРјР°С‚РёСЂРѕРІР°РЅРёРµ" },
  icon: <span style={{ fontSize: 12 }}>Tx</span>,
  execute: (state, api) => {
    api.replaceSelection((state.selectedText || "").replace(/<[^>]*>/g, ""));
  },
};

// ==================== РњР°СЃСЃРёРІС‹ РєРѕРјР°РЅРґ ====================

const fullCommands = [
  commands.bold,
  commands.italic,
  commands.strikethrough,
  commands.hr,
  commands.title1,
  commands.title2,
  commands.title3,
  commands.title4,
  commands.title5,
  commands.title6,
  commands.link,
  commands.quote,
  commands.code,
  commands.codeBlock,
  commands.image,
  commands.unorderedListCommand,
  commands.orderedListCommand,
  commands.checkedListCommand,
  commands.table,
  alignLeftCommand,
  alignCenterCommand,
  alignRightCommand,
  alignJustifyCommand,
  fontSizeIncreaseCommand,
  fontSizeDecreaseCommand,
  fontStemCommand,
  fontTTCommand,
  colorOrangeCommand,
  colorDarkCommand,
  colorDark50Command,
  heading1AdaptiveCommand,
  body1AdaptiveCommand,
  body2AdaptiveCommand,
  numberedListCommand,
  discListCommand,
  squareListCommand,
  checkListCommand,
  clearFormattingCommand,
];

const metaCommands = [
  metaHeading1AdaptiveCommand,
  metaText1AdaptiveCommand,
  commands.link,
  colorOrangeCommand,
  colorDarkCommand,
  colorDark50Command,
  clearFormattingCommand,
];

// ==================== РћСЃРЅРѕРІРЅРѕР№ РєРѕРјРїРѕРЅРµРЅС‚ ====================

interface VpnPostEditorProps {
  onSave?: (updatedPost: VpnPost) => void;
}

export const VpnPostEditor: React.FC<VpnPostEditorProps> = ({ onSave }) => {
  const { data: posts, isLoading: isLoadingPosts } = useVpnPosts();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const {
    data: selectedPost,
    isLoading: isLoadingContent,
    error,
  } = useVpnPost(selectedSlug || undefined);
  const createMutation = useCreateVpnPost();
  const updateMutation = useUpdateVpnPost();
  const deleteMutation = useDeleteVpnPost();

  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [readTime, setReadTime] = useState("");
  const [author, setAuthor] = useState("");
  const [providerName, setProviderName] = useState("");
  const [image, setImage] = useState("");
  const [providerUrl, setProviderUrl] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [newPost, setNewPost] = useState<Partial<VpnPost>>({
    title: "",
    excerpt: "",
    slug: "",
    category: "VPN",
    tags: [],
    author: "РљРѕРјР°РЅРґР° TopCloudHub",
    date: new Date().toLocaleDateString("ru-RU"),
    readTime: "5 РјРёРЅ",
    image: "",
    providerUrl: "",
    providerName: "",
  });

  useEffect(() => {
    if (selectedPost) {
      setContent(selectedPost.content || "");
      setTitle(selectedPost.title || "");
      setExcerpt(selectedPost.excerpt || "");
      setCategory(selectedPost.category || "");
      setReadTime(selectedPost.readTime || "");
      setAuthor(selectedPost.author || "");
      setImage(selectedPost.image || "");
      setProviderUrl(selectedPost.providerUrl || "");
      setProviderName(selectedPost.providerName || "");
      setTags(selectedPost.tags || []);
      setIsCreating(false);
    }
  }, [selectedPost]);

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleCreateNew = () => {
    setIsCreating(true);
    setSelectedSlug(null);
    setContent("");
    setTitle("");
    setExcerpt("");
    setCategory("VPN");
    setReadTime("5 РјРёРЅ");
    setAuthor("РљРѕРјР°РЅРґР° TopCloudHub");
    setImage("");
    setProviderUrl("");
    setProviderName("");
    setTags([]);
    setNewPost({
      title: "",
      excerpt: "",
      slug: "",
      category: "VPN",
      tags: [],
      author: "РљРѕРјР°РЅРґР° TopCloudHub",
      date: new Date().toLocaleDateString("ru-RU"),
      readTime: "5 РјРёРЅ",
      image: "",
      providerUrl: "",
      providerName: "",
    });
  };

  // ==================== РРЎРџР РђР’Р›Р•РќРќРђРЇ Р¤РЈРќРљР¦РРЇ generateSlug ====================
  // Р‘С‹Р»Рѕ: РєРёСЂРёР»Р»РёС†Р° РѕСЃС‚Р°РІР°Р»Р°СЃСЊ РІ slug РєР°Рє РµСЃС‚СЊ в†’ СЃР»РѕРјР°РЅРЅС‹Рµ URL
  // РЎС‚Р°Р»Рѕ: РїРѕР»РЅР°СЏ С‚СЂР°РЅСЃР»РёС‚РµСЂР°С†РёСЏ + РѕРіСЂР°РЅРёС‡РµРЅРёРµ РґР»РёРЅС‹ 80 СЃРёРјРІРѕР»РѕРІ
  const generateSlug = (title: string): string => {
    const translit: Record<string, string> = {
      Р°: "a",  Р±: "b",  РІ: "v",  Рі: "g",  Рґ: "d",
      Рµ: "e",  С‘: "e",  Р¶: "zh", Р·: "z",  Рё: "i",
      Р№: "y",  Рє: "k",  Р»: "l",  Рј: "m",  РЅ: "n",
      Рѕ: "o",  Рї: "p",  СЂ: "r",  СЃ: "s",  С‚: "t",
      Сѓ: "u",  С„: "f",  С…: "kh", С†: "ts", С‡: "ch",
      С€: "sh", С‰: "shch", СЉ: "", С‹: "y",  СЊ: "",
      СЌ: "e",  СЋ: "yu", СЏ: "ya",
    };

    const transliterated = title
      .toLowerCase()
      .split("")
      .map((char) => translit[char] ?? char)
      .join("");

    const slug = transliterated
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // РћР±СЂРµР·Р°РµРј РґРѕ 80 СЃРёРјРІРѕР»РѕРІ РїРѕ РіСЂР°РЅРёС†Рµ СЃР»РѕРІР°
    return slug
      .split("-")
      .reduce((acc, part) => {
        const next = acc ? `${acc}-${part}` : part;
        return next.length <= 80 ? next : acc;
      }, "");
  };
  // =========================================================================

  const handleTitleChange = (val: string | undefined) => {
    const newTitle = val || "";
    setTitle(newTitle);
    if (isCreating) {
      setNewPost({ ...newPost, title: newTitle, slug: generateSlug(newTitle) });
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setSelectedSlug(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (isCreating) {
        if (!title || !content) {
          toast.error("Р—Р°РіРѕР»РѕРІРѕРє Рё СЃРѕРґРµСЂР¶РёРјРѕРµ РѕР±СЏР·Р°С‚РµР»СЊРЅС‹");
          return;
        }
        const newData = {
          title,
          content,
          excerpt,
          category,
          read_time: readTime,
          author,
          image,
          provider_url: providerUrl,
          provider_name: providerName,
          tags,
          slug: generateSlug(title),
        };
        const created = await createMutation.mutateAsync(newData);
        toast.success("РЎС‚Р°С‚СЊСЏ СЃРѕР·РґР°РЅР°");
        setSelectedSlug(created.slug);
        setIsCreating(false);
        onSave?.(created);
      } else {
        if (!selectedPost) return;
        const updatedData = {
          slug: selectedPost.slug,
          content,
          title,
          excerpt,
          category,
          read_time: readTime,
          author,
          image,
          provider_url: providerUrl,
          provider_name: providerName,
          tags,
        };
        const updated = await updateMutation.mutateAsync(updatedData);
        toast.success("РЎС‚Р°С‚СЊСЏ СЃРѕС…СЂР°РЅРµРЅР°");
        setSelectedSlug(updated.slug);
        onSave?.(updated);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "РћС€РёР±РєР° РїСЂРё СЃРѕС…СЂР°РЅРµРЅРёРё",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPost) return;
    try {
      await deleteMutation.mutateAsync(selectedPost.slug);
      toast.success("РЎС‚Р°С‚СЊСЏ СѓРґР°Р»РµРЅР°");
      setSelectedSlug(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "РћС€РёР±РєР° РїСЂРё СѓРґР°Р»РµРЅРёРё",
      );
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Icon name="PenLine" size={20} className="text-primary" />
              {isCreating
                ? "РќРѕРІР°СЏ СЃС‚Р°С‚СЊСЏ"
                : selectedPost
                  ? "Р РµРґР°РєС‚РёСЂРѕРІР°РЅРёРµ СЃС‚Р°С‚СЊРё"
                  : "Р РµРґР°РєС‚РѕСЂ VPN-СЃС‚Р°С‚РµР№"}
            </CardTitle>
            {!isCreating && (
              <Button onClick={handleCreateNew} className="gap-2">
                <Icon name="Plus" size={16} />
                РќРѕРІР°СЏ СЃС‚Р°С‚СЊСЏ
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {!isCreating && (
            <div className="mb-6">
              {isLoadingPosts ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  Р—Р°РіСЂСѓР·РєР° СЃРїРёСЃРєР° СЃС‚Р°С‚РµР№...
                </div>
              ) : (
                <Select
                  value={selectedSlug || ""}
                  onValueChange={(slug) => setSelectedSlug(slug)}
                >
                  <SelectTrigger className="w-full max-w-md">
                    <SelectValue placeholder="Р’С‹Р±РµСЂРёС‚Рµ СЃС‚Р°С‚СЊСЋ РґР»СЏ СЂРµРґР°РєС‚РёСЂРѕРІР°РЅРёСЏ" />
                  </SelectTrigger>
                  <SelectContent>
                    {posts?.map((post) => (
                      <SelectItem key={post.id} value={post.slug}>
                        {post.title.replace(/<[^>]*>/g, "")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg">
              <p>РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё СЃС‚Р°С‚СЊРё: {error.message}</p>
            </div>
          )}

          {isLoadingContent && (
            <div className="flex items-center justify-center py-12">
              <Icon name="Loader2" size={32} className="animate-spin text-primary" />
            </div>
          )}

          {(selectedPost || isCreating) && !isLoadingContent && (
            <>
              <div className="mb-6 space-y-4 p-4 bg-muted/50 rounded-lg">
                {/* Р—Р°РіРѕР»РѕРІРѕРє */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1 block">
                    Р—Р°РіРѕР»РѕРІРѕРє *
                  </label>
                  <div data-color-mode="light" className="border rounded-lg overflow-hidden">
                    <MDEditor
                      value={title}
                      onChange={handleTitleChange}
                      preview="edit"
                      height={80}
                      visibleDragbar={false}
                      commands={metaCommands}
                    />
                  </div>
                </div>

                {/* РљСЂР°С‚РєРѕРµ РѕРїРёСЃР°РЅРёРµ */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1 block">
                    РљСЂР°С‚РєРѕРµ РѕРїРёСЃР°РЅРёРµ (excerpt)
                  </label>
                  <div data-color-mode="light" className="border rounded-lg overflow-hidden">
                    <MDEditor
                      value={excerpt}
                      onChange={(val) => setExcerpt(val || "")}
                      preview="edit"
                      height={120}
                      visibleDragbar={false}
                      commands={metaCommands}
                    />
                  </div>
                </div>

                {/* Slug вЂ” РїРѕРєР°Р·С‹РІР°РµРј С‚РѕР»СЊРєРѕ РїСЂРё СЃРѕР·РґР°РЅРёРё */}
                {isCreating && (
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1 block">
                      Slug (URL) *
                    </label>
                    <Input
                      value={newPost.slug || generateSlug(title)}
                      onChange={(e) =>
                        setNewPost({ ...newPost, slug: e.target.value })
                      }
                      placeholder="url-adres-stati"
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Р“РµРЅРµСЂРёСЂСѓРµС‚СЃСЏ Р°РІС‚РѕРјР°С‚РёС‡РµСЃРєРё РёР· Р·Р°РіРѕР»РѕРІРєР°, РјРѕР¶РЅРѕ РёР·РјРµРЅРёС‚СЊ РІСЂСѓС‡РЅСѓСЋ
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1 block">
                      РљР°С‚РµРіРѕСЂРёСЏ
                    </label>
                    <div data-color-mode="light" className="border rounded-lg overflow-hidden">
                      <MDEditor
                        value={category}
                        onChange={(val) => setCategory(val || "")}
                        preview="edit"
                        height={60}
                        visibleDragbar={false}
                        commands={metaCommands}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1 block">
                      Р’СЂРµРјСЏ С‡С‚РµРЅРёСЏ
                    </label>
                    <div data-color-mode="light" className="border rounded-lg overflow-hidden">
                      <MDEditor
                        value={readTime}
                        onChange={(val) => setReadTime(val || "")}
                        preview="edit"
                        height={60}
                        visibleDragbar={false}
                        commands={metaCommands}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-1 block">
                    РђРІС‚РѕСЂ
                  </label>
                  <div data-color-mode="light" className="border rounded-lg overflow-hidden">
                    <MDEditor
                      value={author}
                      onChange={(val) => setAuthor(val || "")}
                      preview="edit"
                      height={60}
                      visibleDragbar={false}
                      commands={metaCommands}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1 block">
                      URL РїСЂРѕРІР°Р№РґРµСЂР°
                    </label>
                    <Input
                      value={providerUrl}
                      onChange={(e) => setProviderUrl(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1 block">
                      РќР°Р·РІР°РЅРёРµ РїСЂРѕРІР°Р№РґРµСЂР°
                    </label>
                    <div data-color-mode="light" className="border rounded-lg overflow-hidden">
                      <MDEditor
                        value={providerName}
                        onChange={(val) => setProviderName(val || "")}
                        preview="edit"
                        height={60}
                        visibleDragbar={false}
                        commands={metaCommands}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground mb-1 block">
                    URL РёР·РѕР±СЂР°Р¶РµРЅРёСЏ (РїСЂРµРІСЊСЋ)
                  </label>
                  <Input
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="/images/preview.jpg"
                  />
                </div>

                {/* РўРµРіРё */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1 block">
                    РўРµРіРё
                  </label>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <Icon name="X" size={12} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="РќРѕРІС‹Р№ С‚РµРі"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button onClick={handleAddTag} variant="outline">
                      Р”РѕР±Р°РІРёС‚СЊ
                    </Button>
                  </div>
                </div>
              </div>

              {/* РћСЃРЅРѕРІРЅРѕР№ РєРѕРЅС‚РµРЅС‚ */}
              <div data-color-mode="light" className="border rounded-lg overflow-hidden">
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || "")}
                  preview="live"
                  height={500}
                  visibleDragbar={false}
                  commands={fullCommands}
                />
              </div>

              <div className="mt-6 flex justify-end gap-4">
                {!isCreating && selectedPost && (
                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    disabled={deleteMutation.isPending}
                    className="gap-2"
                  >
                    {deleteMutation.isPending ? (
                      <Icon name="Loader2" size={16} className="animate-spin" />
                    ) : (
                      <Icon name="Trash2" size={16} />
                    )}
                    РЈРґР°Р»РёС‚СЊ
                  </Button>
                )}

                <Button variant="outline" onClick={handleCancel}>
                  РћС‚РјРµРЅР°
                </Button>

                <Button
                  onClick={handleSave}
                  disabled={isSaving || createMutation.isPending || updateMutation.isPending}
                  className="bg-primary text-background"
                >
                  {isSaving || createMutation.isPending || updateMutation.isPending ? (
                    <>
                      <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                      РЎРѕС…СЂР°РЅРµРЅРёРµ...
                    </>
                  ) : (
                    <>
                      <Icon name="Save" size={16} className="mr-2" />
                      РЎРѕС…СЂР°РЅРёС‚СЊ
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>РЈРґР°Р»РёС‚СЊ СЃС‚Р°С‚СЊСЋ?</AlertDialogTitle>
            <AlertDialogDescription>
              Р­С‚Рѕ РґРµР№СЃС‚РІРёРµ РЅРµР»СЊР·СЏ РѕС‚РјРµРЅРёС‚СЊ. РЎС‚Р°С‚СЊСЏ Р±СѓРґРµС‚ СѓРґР°Р»РµРЅР° Р±РµР·РІРѕР·РІСЂР°С‚РЅРѕ.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>РћС‚РјРµРЅР°</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              РЈРґР°Р»РёС‚СЊ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
