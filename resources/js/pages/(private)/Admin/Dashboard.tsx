import { useState, useEffect } from "react";
import AppLayout from "@/layouts/AppLayout";
import Reveal from "@/components/ui/Reveal";
import api from "@/services/api";
import { Category } from "@/types";
import { PlusCircle, Package, Layers, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"product" | "category">("product");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Product Form State
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    image: ""
  });

  // Category Form State
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    slug: ""
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Erro ao buscar categorias", err);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await api.post("/products", {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock)
      });
      setMessage({ type: "success", text: "Produto adicionado com sucesso!" });
      setProductForm({ name: "", description: "", price: "", stock: "", category_id: "", image: "" });
    } catch (err: any) {
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Erro ao adicionar produto. Verifique os campos." 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await api.post("/categories", categoryForm);
      setMessage({ type: "success", text: "Categoria adicionada com sucesso!" });
      setCategoryForm({ name: "", slug: "" });
      fetchCategories(); // Refresh list
    } catch (err: any) {
      setMessage({ 
        type: "error", 
        text: err.response?.data?.message || "Erro ao adicionar categoria. Verifique os campos." 
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200 text-sm";
  const labelClasses = "block text-sm font-medium text-zinc-700 mb-1.5 ml-1";

  return (
    <AppLayout>
      <div className="min-h-screen pt-32 pb-20 px-6 sm:px-10 bg-zinc-50/30">
        <div className="max-w-4xl mx-auto">
          
          <Reveal>
            <div className="mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-black flex items-center gap-3">
                Painel Administrativo
              </h1>
              <p className="text-zinc-500 mt-2 text-lg">Gerencie seu inventário e categorias de forma simples.</p>
            </div>
          </Reveal>

          {/* Navigation Tabs */}
          <Reveal>
            <div className="flex p-1 bg-zinc-100 rounded-2xl mb-10 w-fit">
              <button
                onClick={() => { setActiveTab("product"); setMessage(null); }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === "product" 
                  ? "bg-white text-black shadow-sm" 
                  : "text-zinc-500 hover:text-black"
                }`}
              >
                <Package size={18} />
                Produtos
              </button>
              <button
                onClick={() => { setActiveTab("category"); setMessage(null); }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === "category" 
                  ? "bg-white text-black shadow-sm" 
                  : "text-zinc-500 hover:text-black"
                }`}
              >
                <Layers size={18} />
                Categorias
              </button>
            </div>
          </Reveal>

          {/* Message Alert */}
          {message && (
            <Reveal>
              <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 border shadow-sm ${
                message.type === "success" 
                ? "bg-emerald-50 border-emerald-100 text-emerald-800" 
                : "bg-rose-50 border-rose-100 text-rose-800"
              }`}>
                {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            </Reveal>
          )}

          <Reveal>
            <div className="bg-white border border-zinc-100 rounded-[2rem] shadow-sm p-8 sm:p-12">
              {activeTab === "product" ? (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-zinc-100 rounded-2xl">
                      <PlusCircle className="text-black" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Novo Produto</h2>
                      <p className="text-sm text-zinc-500">Preencha os dados abaixo para cadastrar um item.</p>
                    </div>
                  </div>

                  <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="md:col-span-2">
                      <label className={labelClasses}>Nome do Produto</label>
                      <input
                        type="text"
                        required
                        className={inputClasses}
                        placeholder="Ex: Camiseta Oversized Black"
                        value={productForm.name}
                        onChange={e => setProductForm({...productForm, name: e.target.value})}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className={labelClasses}>Descrição</label>
                      <textarea
                        rows={4}
                        required
                        className={`${inputClasses} resize-none`}
                        placeholder="Descreva os detalhes e diferenciais do produto..."
                        value={productForm.description}
                        onChange={e => setProductForm({...productForm, description: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>Preço (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        className={inputClasses}
                        placeholder="0.00"
                        value={productForm.price}
                        onChange={e => setProductForm({...productForm, price: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>Estoque Inicial</label>
                      <input
                        type="number"
                        required
                        className={inputClasses}
                        placeholder="0"
                        value={productForm.stock}
                        onChange={e => setProductForm({...productForm, stock: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>Categoria</label>
                      <select
                        required
                        className={inputClasses}
                        value={productForm.category_id}
                        onChange={e => setProductForm({...productForm, category_id: e.target.value})}
                      >
                        <option value="">Selecione uma categoria</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClasses}>URL da Imagem</label>
                      <input
                        type="url"
                        required
                        className={inputClasses}
                        placeholder="https://exemplo.com/imagem.jpg"
                        value={productForm.image}
                        onChange={e => setProductForm({...productForm, image: e.target.value})}
                      />
                    </div>

                    <div className="md:col-span-2 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-4 rounded-2xl font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:bg-zinc-300"
                      >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <PlusCircle size={20} />}
                        {loading ? "Processando..." : "Cadastrar Produto"}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-zinc-100 rounded-2xl">
                      <Layers className="text-black" size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">Nova Categoria</h2>
                      <p className="text-sm text-zinc-500">Defina uma nova categoria para organizar seus produtos.</p>
                    </div>
                  </div>

                  <form onSubmit={handleCategorySubmit} className="space-y-6">
                    <div>
                      <label className={labelClasses}>Nome da Categoria</label>
                      <input
                        type="text"
                        required
                        className={inputClasses}
                        placeholder="Ex: Acessórios"
                        value={categoryForm.name}
                        onChange={e => {
                          const name = e.target.value;
                          setCategoryForm({
                            name,
                            slug: name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                          });
                        }}
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>Slug (Identificador na URL)</label>
                      <input
                        type="text"
                        required
                        className={inputClasses}
                        placeholder="ex: acessorios"
                        value={categoryForm.slug}
                        onChange={e => setCategoryForm({...categoryForm, slug: e.target.value})}
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-4 rounded-2xl font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:bg-zinc-300"
                      >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <PlusCircle size={20} />}
                        {loading ? "Processando..." : "Cadastrar Categoria"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </AppLayout>
  );
}
