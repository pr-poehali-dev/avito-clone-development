import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

type Tab = "listings" | "favorites" | "chat" | "profile";

const CATEGORIES = [
  { id: "all", label: "Все категории" },
  { id: "realty", label: "Недвижимость" },
  { id: "equipment", label: "Оборудование" },
  { id: "services", label: "Услуги" },
  { id: "transport", label: "Транспорт" },
  { id: "materials", label: "Материалы" },
  { id: "it", label: "IT и технологии" },
];

const CITIES = ["Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань", "Нижний Новгород"];

const LISTINGS = [
  {
    id: 1,
    title: "Аренда офисного помещения, класс А",
    category: "realty",
    price: 850000,
    unit: "мес",
    city: "Москва",
    area: "Центральный округ",
    date: "14 мая 2026",
    desc: "Современный офис 320 м² в бизнес-центре класса А. Панорамные окна, переговорные комнаты, подземный паркинг.",
    tags: ["Аренда", "320 м²", "Класс А"],
    isVerified: true,
    contact: "ООО «Центр Офис»",
  },
  {
    id: 2,
    title: "Промышленный токарный станок ЧПУ",
    category: "equipment",
    price: 4200000,
    unit: "шт",
    city: "Екатеринбург",
    area: "Верх-Исетский р-н",
    date: "13 мая 2026",
    desc: "Токарный станок с ЧПУ, 2021 г.в., в отличном состоянии. Полный комплект документации и сервисного обслуживания.",
    tags: ["ЧПУ", "2021 г.в.", "Новый"],
    isVerified: true,
    contact: "Завод «УралМаш»",
  },
  {
    id: 3,
    title: "Юридическое сопровождение сделок M&A",
    category: "services",
    price: 180000,
    unit: "сделка",
    city: "Москва",
    area: "Пресненский р-н",
    date: "12 мая 2026",
    desc: "Полное юридическое сопровождение слияний и поглощений. Команда из 5 специалистов, опыт 15 лет на рынке.",
    tags: ["Юристы", "M&A", "Срочно"],
    isVerified: false,
    contact: "Бюро «Правовой Эксперт»",
  },
  {
    id: 4,
    title: "Грузовой автопарк в аренду, 12 единиц",
    category: "transport",
    price: 95000,
    unit: "мес",
    city: "Санкт-Петербург",
    area: "Выборгский р-н",
    date: "11 мая 2026",
    desc: "Автопарк из 12 грузовых автомобилей MAN TGX. Водители в штате, GPS-мониторинг, страховка включена.",
    tags: ["12 единиц", "MAN TGX", "С водителями"],
    isVerified: true,
    contact: "ТК «СевероЗапад»",
  },
  {
    id: 5,
    title: "Поставка строительного кирпича М150",
    category: "materials",
    price: 18,
    unit: "шт",
    city: "Казань",
    area: "Авиастроительный р-н",
    date: "10 мая 2026",
    desc: "Кирпич керамический полнотелый М150. Собственное производство. Объём от 50 000 штук. Доставка по РФ.",
    tags: ["М150", "Оптом", "Доставка"],
    isVerified: true,
    contact: "ЗАО «КазаньКирпич»",
  },
  {
    id: 6,
    title: "Разработка корпоративной CRM-системы",
    category: "it",
    price: 2500000,
    unit: "проект",
    city: "Москва",
    area: "Таганский р-н",
    date: "9 мая 2026",
    desc: "Разработка CRM под ключ: аналитика, интеграция с 1С, мобильное приложение. Срок — 4 месяца.",
    tags: ["CRM", "Под ключ", "1С"],
    isVerified: false,
    contact: "IT-студия «DigitalCore»",
  },
];

const CHAT_MESSAGES = [
  {
    id: 1,
    contact: "ООО «Центр Офис»",
    lastMsg: "Добрый день! Офис ещё доступен для просмотра.",
    time: "14:32",
    unread: 2,
    listing: "Аренда офисного помещения",
  },
  {
    id: 2,
    contact: "Бюро «Правовой Эксперт»",
    lastMsg: "Готовы выслать коммерческое предложение.",
    time: "11:15",
    unread: 0,
    listing: "Юридическое сопровождение M&A",
  },
  {
    id: 3,
    contact: "ТК «СевероЗапад»",
    lastMsg: "Когда удобно согласовать договор?",
    time: "Вчера",
    unread: 1,
    listing: "Грузовой автопарк в аренду",
  },
];

const formatPrice = (price: number) => {
  if (price >= 1000000) return `${(price / 1000000).toFixed(1)} млн ₽`;
  if (price >= 1000) return `${(price / 1000).toFixed(0)} тыс. ₽`;
  return `${price} ₽`;
};

const categoryIcon: Record<string, string> = {
  realty: "Building2",
  equipment: "Settings2",
  services: "Handshake",
  transport: "Truck",
  materials: "Package",
  it: "Monitor",
};

const UNITS = ["шт", "мес", "год", "проект", "услуга", "кг", "м²", "м³", "л"];

interface NewListing {
  title: string;
  category: string;
  city: string;
  price: string;
  unit: string;
  desc: string;
  contact: string;
  photos: string[];
}

const EMPTY_FORM: NewListing = {
  title: "",
  category: "realty",
  city: "",
  price: "",
  unit: "шт",
  desc: "",
  contact: "",
  photos: [],
};

function NewListingModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: NewListing) => void;
}) {
  const [form, setForm] = useState<NewListing>(EMPTY_FORM);
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof NewListing, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const previews = files.map((f) => URL.createObjectURL(f));
    setForm((prev) => ({ ...prev, photos: [...prev.photos, ...previews].slice(0, 5) }));
  };

  const removePhoto = (idx: number) =>
    setForm((f) => ({ ...f, photos: f.photos.filter((_, i) => i !== idx) }));

  const canNext =
    form.title.trim() && form.category && form.city.trim() && form.price.trim();

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => onSubmit(form), 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-card border rounded-lg w-full max-w-xl shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-sm">Новое объявление</h2>
            <p className="text-xs text-blue-300 mt-0.5">Шаг {step} из 2</p>
          </div>
          <button onClick={onClose} className="text-blue-300 hover:text-white transition-colors">
            <Icon name="X" size={18} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-blue-900">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>

        {submitted ? (
          <div className="p-12 text-center space-y-3 animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <Icon name="CheckCircle" size={28} className="text-emerald-600" />
            </div>
            <h3 className="font-semibold">Объявление отправлено на модерацию</h3>
            <p className="text-sm text-muted-foreground">Обычно проверка занимает до 2 часов</p>
          </div>
        ) : step === 1 ? (
          <div className="p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Заголовок объявления *
              </label>
              <Input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Например: Аренда склада 500 м²"
                className="text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Категория *
                </label>
                <div className="grid grid-cols-1 gap-0.5 border rounded overflow-hidden">
                  {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => set("category", cat.id)}
                      className={`px-3 py-1.5 text-sm text-left transition-colors ${
                        form.category === cat.id
                          ? "bg-accent text-white"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Город *
                  </label>
                  <div className="grid grid-cols-1 gap-0.5 border rounded overflow-hidden">
                    {CITIES.map((city) => (
                      <button
                        key={city}
                        onClick={() => set("city", city)}
                        className={`px-3 py-1.5 text-sm text-left transition-colors ${
                          form.city === city
                            ? "bg-accent text-white"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Цена (₽) *
                </label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="0"
                  className="text-sm font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Единица
                </label>
                <div className="flex flex-wrap gap-1">
                  {UNITS.map((u) => (
                    <button
                      key={u}
                      onClick={() => set("unit", u)}
                      className={`px-2 py-1 text-xs rounded border transition-colors ${
                        form.unit === u
                          ? "bg-accent text-white border-accent"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                className="bg-accent text-white hover:bg-blue-600 gap-1.5"
                disabled={!canNext}
                onClick={() => setStep(2)}
              >
                Далее
                <Icon name="ArrowRight" size={14} />
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Описание
              </label>
              <Textarea
                value={form.desc}
                onChange={(e) => set("desc", e.target.value)}
                placeholder="Подробно опишите товар или услугу, укажите характеристики, условия..."
                className="text-sm resize-none h-28"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Контактное лицо / организация
              </label>
              <Input
                value={form.contact}
                onChange={(e) => set("contact", e.target.value)}
                placeholder="ООО «Название» или ФИО"
                className="text-sm"
              />
            </div>

            {/* Photo upload */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Фотографии (до 5)
              </label>
              <div className="flex flex-wrap gap-2">
                {form.photos.map((src, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded border overflow-hidden group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(idx)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <Icon name="X" size={16} className="text-white" />
                    </button>
                  </div>
                ))}
                {form.photos.length < 5 && (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-20 h-20 rounded border-2 border-dashed border-border hover:border-accent transition-colors flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-accent"
                  >
                    <Icon name="ImagePlus" size={20} />
                    <span className="text-xs">Фото</span>
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFile}
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-1">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="ArrowLeft" size={14} />
                Назад
              </button>
              <Button
                className="bg-accent text-white hover:bg-blue-600 gap-1.5"
                onClick={handleSubmit}
              >
                <Icon name="Send" size={14} />
                Опубликовать
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("listings");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCity, setSelectedCity] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([1, 3]);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [showNewListing, setShowNewListing] = useState(false);

  const filteredListings = LISTINGS.filter((l) => {
    const matchCat = selectedCategory === "all" || l.category === selectedCategory;
    const matchCity = !selectedCity || l.city === selectedCity;
    const matchPrice = l.price >= priceRange[0] && l.price <= priceRange[1];
    const matchSearch =
      !searchQuery ||
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchCity && matchPrice && matchSearch;
  });

  const favoriteListings = LISTINGS.filter((l) => favorites.includes(l.id));

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const navItems: { id: Tab; icon: string; label: string }[] = [
    { id: "listings", icon: "LayoutGrid", label: "Объявления" },
    { id: "favorites", icon: "Heart", label: "Избранное" },
    { id: "chat", icon: "MessageSquare", label: "Чат" },
    { id: "profile", icon: "User", label: "Кабинет" },
  ];

  const totalUnread = CHAT_MESSAGES.reduce((a, m) => a + m.unread, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50 border-b border-blue-900">
        <div className="container max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-accent rounded flex items-center justify-center">
              <Icon name="Briefcase" size={14} className="text-white" />
            </div>
            <span className="font-semibold text-sm tracking-tight">БизнесДоска</span>
            <span className="hidden md:inline text-xs text-blue-300 font-mono border border-blue-700 rounded px-1.5 py-0.5">
              BETA
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded text-sm font-medium transition-all duration-150 ${
                  activeTab === item.id
                    ? "bg-accent text-white"
                    : "text-blue-200 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon name={item.icon} size={14} />
                {item.label}
                {item.id === "chat" && totalUnread > 0 && (
                  <span className="ml-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {totalUnread}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <Button
            size="sm"
            className="hidden md:flex items-center gap-1.5 bg-accent text-white hover:bg-blue-500 text-xs h-8 px-3"
            onClick={() => setShowNewListing(true)}
          >
            <Icon name="Plus" size={13} />
            Разместить
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-5 pb-20 md:pb-5">

        {/* ─── LISTINGS ─── */}
        {activeTab === "listings" && (
          <div className="flex gap-5 animate-fade-in">
            {/* Sidebar */}
            {showFilters && (
              <aside className="w-60 flex-shrink-0 space-y-0">
                <div className="bg-card border rounded overflow-hidden">
                  <div className="px-4 py-3 border-b flex items-center justify-between bg-muted/50">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Фильтры
                    </span>
                    <button
                      onClick={() => {
                        setSelectedCategory("all");
                        setSelectedCity("");
                        setPriceRange([0, 5000000]);
                        setSearchQuery("");
                      }}
                      className="text-xs text-muted-foreground hover:text-accent transition-colors"
                    >
                      Сбросить
                    </button>
                  </div>

                  {/* Category */}
                  <div className="p-3 border-b">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      Категория
                    </p>
                    <div className="space-y-0.5">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`w-full text-left px-2.5 py-1.5 rounded text-sm transition-colors ${
                            selectedCategory === cat.id
                              ? "bg-accent text-white font-medium"
                              : "text-foreground hover:bg-muted"
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* City */}
                  <div className="p-3 border-b">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                      Город
                    </p>
                    <div className="space-y-0.5">
                      <button
                        onClick={() => setSelectedCity("")}
                        className={`w-full text-left px-2.5 py-1.5 rounded text-sm transition-colors ${
                          !selectedCity ? "bg-accent text-white font-medium" : "text-foreground hover:bg-muted"
                        }`}
                      >
                        Все города
                      </button>
                      {CITIES.map((city) => (
                        <button
                          key={city}
                          onClick={() => setSelectedCity(city)}
                          className={`w-full text-left px-2.5 py-1.5 rounded text-sm transition-colors ${
                            selectedCity === city ? "bg-accent text-white font-medium" : "text-foreground hover:bg-muted"
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="p-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                      Стоимость
                    </p>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={5000000}
                      step={50000}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-xs font-mono text-muted-foreground">
                      <span>{formatPrice(priceRange[0])}</span>
                      <span>{formatPrice(priceRange[1])}</span>
                    </div>
                  </div>
                </div>
              </aside>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* Search bar */}
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  title="Фильтры"
                  className={`p-2 border rounded transition-colors ${
                    showFilters ? "bg-accent text-white border-accent" : "bg-card hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon name="SlidersHorizontal" size={15} />
                </button>
                <div className="relative flex-1">
                  <Icon
                    name="Search"
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск по объявлениям..."
                    className="pl-8 text-sm bg-card h-9"
                  />
                </div>
                <Button
                  className="bg-accent text-white hover:bg-blue-600 h-9 text-sm px-3 gap-1.5"
                  onClick={() => setShowNewListing(true)}
                >
                  <Icon name="Plus" size={14} />
                  Разместить
                </Button>
              </div>

              {/* Count */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Найдено:{" "}
                  <span className="font-semibold text-foreground">{filteredListings.length}</span>{" "}
                  объявлений
                </span>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <Icon name="ArrowUpDown" size={12} />
                  По дате
                </button>
              </div>

              {/* List */}
              {filteredListings.length === 0 ? (
                <div className="bg-card border rounded p-16 text-center space-y-3">
                  <Icon name="SearchX" size={36} className="text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Объявления не найдены</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedCity("");
                      setSearchQuery("");
                    }}
                  >
                    Сбросить фильтры
                  </Button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredListings.map((listing, idx) => (
                    <div
                      key={listing.id}
                      className="bg-card border rounded p-4 card-hover animate-fade-in"
                      style={{ opacity: 0, animationDelay: `${idx * 0.06}s` }}
                    >
                      <div className="flex gap-3">
                        <div className="w-11 h-11 rounded bg-muted flex items-center justify-center flex-shrink-0">
                          <Icon
                            name={categoryIcon[listing.category] ?? "Tag"}
                            size={20}
                            className="text-accent"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-sm text-foreground leading-snug">
                                {listing.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Icon name="MapPin" size={10} />
                                  {listing.city}, {listing.area}
                                </span>
                                {listing.isVerified && (
                                  <span className="flex items-center gap-0.5 text-xs text-emerald-600 font-medium">
                                    <Icon name="BadgeCheck" size={10} />
                                    Проверено
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="text-right flex-shrink-0">
                              <div className="font-bold text-base font-mono text-foreground whitespace-nowrap">
                                {formatPrice(listing.price)}
                              </div>
                              <div className="text-xs text-muted-foreground">за {listing.unit}</div>
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                            {listing.desc}
                          </p>

                          <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
                            <div className="flex flex-wrap gap-1">
                              {listing.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="text-xs px-1.5 py-0 h-5 font-normal"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-muted-foreground">{listing.date}</span>
                              <button
                                onClick={() => toggleFavorite(listing.id)}
                                className={`p-1.5 rounded transition-colors ${
                                  favorites.includes(listing.id)
                                    ? "text-red-500 hover:text-red-400"
                                    : "text-muted-foreground hover:text-red-400"
                                }`}
                              >
                                <Icon name="Heart" size={14} />
                              </button>
                              <Button
                                size="sm"
                                className="h-7 text-xs px-3 bg-accent text-white hover:bg-blue-600"
                                onClick={() => setActiveTab("chat")}
                              >
                                Написать
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t flex items-center gap-1.5">
                        <Icon name="Building" size={11} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{listing.contact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── FAVORITES ─── */}
        {activeTab === "favorites" && (
          <div className="animate-fade-in max-w-3xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Избранное</h2>
              <span className="text-sm text-muted-foreground">{favoriteListings.length} объявлений</span>
            </div>

            {favoriteListings.length === 0 ? (
              <div className="bg-card border rounded p-16 text-center space-y-3">
                <Icon name="Heart" size={36} className="text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">Вы ещё не добавили объявления в избранное</p>
                <Button variant="outline" size="sm" onClick={() => setActiveTab("listings")}>
                  К объявлениям
                </Button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {favoriteListings.map((listing, idx) => (
                  <div
                    key={listing.id}
                    className="bg-card border rounded p-4 card-hover animate-fade-in"
                    style={{ opacity: 0, animationDelay: `${idx * 0.07}s` }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                          <Icon
                            name={categoryIcon[listing.category] ?? "Tag"}
                            size={18}
                            className="text-accent"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{listing.title}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground">{listing.city}</span>
                            <span className="text-xs text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground">{listing.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-bold font-mono text-sm">{formatPrice(listing.price)}</div>
                          <div className="text-xs text-muted-foreground">за {listing.unit}</div>
                        </div>
                        <button
                          onClick={() => toggleFavorite(listing.id)}
                          className="p-1.5 rounded text-red-500 hover:text-red-400 transition-colors"
                          title="Убрать из избранного"
                        >
                          <Icon name="HeartOff" size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── CHAT ─── */}
        {activeTab === "chat" && (
          <div
            className="animate-fade-in flex gap-4"
            style={{ height: "calc(100vh - 152px)" }}
          >
            {/* Conversation list */}
            <div className="w-72 flex-shrink-0 bg-card border rounded overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b bg-muted/50">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Сообщения
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto divide-y">
                {CHAT_MESSAGES.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => setActiveChat(msg.id)}
                    className={`w-full p-3 text-left transition-colors ${
                      activeChat === msg.id ? "bg-muted" : "hover:bg-muted/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <span className="font-medium text-xs text-foreground truncate">
                        {msg.contact}
                      </span>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                        {msg.unread > 0 && (
                          <span className="bg-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium leading-none">
                            {msg.unread}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{msg.lastMsg}</p>
                    <p className="text-xs text-muted-foreground/50 mt-0.5 truncate">
                      📋 {msg.listing}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat window */}
            <div className="flex-1 bg-card border rounded overflow-hidden flex flex-col">
              {activeChat ? (
                <>
                  <div className="px-4 py-3 border-b bg-muted/50 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-sm">
                        {CHAT_MESSAGES.find((m) => m.id === activeChat)?.contact}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {CHAT_MESSAGES.find((m) => m.id === activeChat)?.listing}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                      <Icon name="Phone" size={12} />
                      Связаться
                    </Button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-3 py-2 max-w-sm">
                        <p className="text-sm">Добрый день! Объявление ещё актуально?</p>
                        <p className="text-xs text-muted-foreground mt-1">10:42</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-accent text-white rounded-lg px-3 py-2 max-w-sm">
                        <p className="text-sm">
                          {CHAT_MESSAGES.find((m) => m.id === activeChat)?.lastMsg}
                        </p>
                        <p className="text-xs text-blue-200 mt-1">14:32</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg px-3 py-2 max-w-sm">
                        <p className="text-sm">Когда можно приехать на осмотр?</p>
                        <p className="text-xs text-muted-foreground mt-1">14:50</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 border-t flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Введите сообщение..."
                      className="text-sm flex-1 h-9"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setChatInput("");
                      }}
                    />
                    <Button
                      className="bg-accent text-white hover:bg-blue-600 h-9 px-3"
                      onClick={() => setChatInput("")}
                    >
                      <Icon name="Send" size={14} />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                  <Icon name="MessageSquare" size={36} />
                  <p className="text-sm">Выберите диалог для просмотра</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── PROFILE ─── */}
        {activeTab === "profile" && (
          <div className="animate-fade-in max-w-2xl space-y-4">
            <h2 className="text-base font-semibold">Личный кабинет</h2>

            <div className="bg-card border rounded p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                  АК
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base">Алексей Кузнецов</h3>
                  <p className="text-sm text-muted-foreground">aleksey@company.ru</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Icon name="BadgeCheck" size={12} className="text-emerald-600" />
                    <span className="text-xs text-emerald-600 font-medium">Верифицирован</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                  <Icon name="Pencil" size={12} />
                  Редактировать
                </Button>
              </div>

              <Separator className="mb-4" />

              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: "Объявлений", value: "12" },
                  { label: "Сделок", value: "7" },
                  { label: "Рейтинг", value: "4.9 ★" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="font-bold text-2xl font-mono">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border rounded overflow-hidden">
              <div className="px-4 py-3 border-b bg-muted/50 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Мои объявления
                </h3>
                <Button
                  size="sm"
                  className="h-7 text-xs bg-accent text-white hover:bg-blue-600 gap-1"
                  onClick={() => setShowNewListing(true)}
                >
                  <Icon name="Plus" size={12} />
                  Новое
                </Button>
              </div>
              <div className="divide-y">
                {LISTINGS.slice(0, 3).map((l) => (
                  <div key={l.id} className="flex items-center justify-between px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{l.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {l.date} · {l.city}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                      <span className="font-mono text-sm font-semibold">{formatPrice(l.price)}</span>
                      <Badge
                        className={`text-xs h-5 px-1.5 ${
                          l.isVerified
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                        variant="outline"
                      >
                        {l.isVerified ? "Активно" : "Модерация"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border rounded overflow-hidden divide-y">
              {[
                { icon: "Bell", label: "Уведомления", desc: "Настройка оповещений" },
                { icon: "Shield", label: "Безопасность", desc: "Пароль и двухфакторная аутентификация" },
                { icon: "CreditCard", label: "Тарифный план", desc: "Базовый — до 20 объявлений" },
                { icon: "HelpCircle", label: "Поддержка", desc: "Обращение в службу поддержки" },
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                >
                  <Icon name={item.icon} size={15} className="text-accent flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* New listing modal */}
      {showNewListing && (
        <NewListingModal
          onClose={() => setShowNewListing(false)}
          onSubmit={() => {
            setTimeout(() => setShowNewListing(false), 1800);
          }}
        />
      )}

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t flex z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors relative ${
              activeTab === item.id ? "text-accent" : "text-muted-foreground"
            }`}
          >
            <Icon name={item.icon} size={20} />
            <span className="text-xs">{item.label}</span>
            {item.id === "chat" && totalUnread > 0 && (
              <span className="absolute top-1.5 right-[22%] bg-red-500 text-white text-xs rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none">
                {totalUnread}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}