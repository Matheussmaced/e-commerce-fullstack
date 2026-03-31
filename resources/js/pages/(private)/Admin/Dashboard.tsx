import { useState, useEffect } from "react";
import AppLayout from "@/layouts/AppLayout";
import Reveal from "@/components/ui/Reveal";
import api from "@/services/api";
import { Category, User } from "@/types";
import { PlusCircle, Package, Layers, CheckCircle2, AlertCircle, Loader2, Users, ShoppingCart, Trash2 } from "lucide-react";

interface Shipment {
  id: string;
  order_id: string;
  shipping_cost: number;
  status: string;
  tracking_code: string | null;
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  created_at: string;
  user?: User;
  shipment?: Shipment;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"product" | "category" | "order" | "user">("product");
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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

  // Verificar se o usuário é admin
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    api.get("/me")
      .then(response => {
        const user: User = response.data;
        if (user.role === "admin") {
          setAuthorized(true);
          setCurrentUser(user);
        } else {
          window.location.href = "/";
        }
      })
      .catch(() => {
        window.location.href = "/login";
      })
      .finally(() => {
        setCheckingAuth(false);
      });
  }, []);

  useEffect(() => {
    if (authorized) {
      fetchCategories();
      fetchOrders();
      fetchUsers();
    }
  }, [authorized]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Erro ao buscar categorias", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/all");
      setOrders(res.data);
    } catch (err) {
      console.error("Erro ao buscar pedidos", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Erro ao buscar usuários", err);
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
        text: err.response?.data?.message || "Erro ao adicionar produto."
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
      fetchCategories();
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erro ao adicionar categoria."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShipmentStatusChange = async (shipmentId: string, newStatus: string) => {
    try {
      await api.patch(`/shipments/${shipmentId}`, { status: newStatus });
      setMessage({ type: "success", text: "Status de envio atualizado!" });
      fetchOrders();
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erro ao atualizar status."
      });
    }
  };

  const handleUserDelete = async (userId: number) => {
    if (!confirm("Tem certeza que deseja excluir este usuário permanentemente?")) return;

    try {
      await api.delete(`/users/${userId}`);
      setMessage({ type: "success", text: "Usuário excluído com sucesso!" });
      fetchUsers();
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Erro ao excluir usuário."
      });
    }
  };

  const inputClasses = "text-gray-500 w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200 text-sm ";
  const labelClasses = "block text-sm font-medium text-zinc-700 mb-1.5 ml-1";

  if (checkingAuth || !authorized) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center bg-zinc-50/30">
          <Loader2 className="animate-spin text-zinc-400" size={40} />
        </div>
      </AppLayout>
    );
  }

  const navigateTab = (tab: "product" | "category" | "order" | "user") => {
    setActiveTab(tab);
    setMessage(null);
  }

  return (
    <AppLayout>
      <div className="min-h-screen pt-32 pb-20 bg-zinc-50/30">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <Reveal>
            <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
              <div className="mb-6 px-4">
                <h1 className="text-2xl font-bold tracking-tight text-black">Painel Admin</h1>
                <p className="text-sm text-zinc-500 mt-1">Gerencie a loja</p>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => navigateTab("product")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === "product"
                    ? "bg-black text-white shadow-md shadow-black/5"
                    : "text-zinc-500 hover:text-black hover:bg-zinc-100"
                    }`}
                >
                  <Package size={18} />
                  Produtos
                </button>
                <button
                  onClick={() => navigateTab("category")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === "category"
                    ? "bg-black text-white shadow-md shadow-black/5"
                    : "text-zinc-500 hover:text-black hover:bg-zinc-100"
                    }`}
                >
                  <Layers size={18} />
                  Categorias
                </button>
                <button
                  onClick={() => navigateTab("order")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === "order"
                    ? "bg-black text-white shadow-md shadow-black/5"
                    : "text-zinc-500 hover:text-black hover:bg-zinc-100"
                    }`}
                >
                  <ShoppingCart size={18} />
                  Pedidos
                </button>
                <button
                  onClick={() => navigateTab("user")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === "user"
                    ? "bg-black text-white shadow-md shadow-black/5"
                    : "text-zinc-500 hover:text-black hover:bg-zinc-100"
                    }`}
                >
                  <Users size={18} />
                  Usuários
                </button>
              </div>
            </div>
          </Reveal>

          {/* Main Content Area */}
          <div className="flex-1">
            {message && (
              <Reveal>
                <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 border shadow-sm ${message.type === "success"
                  ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                  : "bg-rose-50 border-rose-100 text-rose-800"
                  }`}>
                  {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
              </Reveal>
            )}

            <Reveal>
              <div className="bg-white border border-zinc-100 rounded-[2rem] shadow-sm p-6 sm:p-10">
                {activeTab === "product" && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-zinc-100 rounded-2xl">
                        <PlusCircle className="text-black" size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">Novo Produto</h2>
                        <p className="text-sm text-zinc-500">Cadastre um item no inventário.</p>
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
                          onChange={e => setProductForm({ ...productForm, name: e.target.value })}
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
                          onChange={e => setProductForm({ ...productForm, description: e.target.value })}
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
                          onChange={e => setProductForm({ ...productForm, price: e.target.value })}
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
                          onChange={e => setProductForm({ ...productForm, stock: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Categoria</label>
                        <select
                          required
                          className={inputClasses}
                          value={productForm.category_id}
                          onChange={e => setProductForm({ ...productForm, category_id: e.target.value })}
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
                          onChange={e => setProductForm({ ...productForm, image: e.target.value })}
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
                )}

                {activeTab === "category" && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-zinc-100 rounded-2xl">
                        <Layers className="text-black" size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">Nova Categoria</h2>
                        <p className="text-sm text-zinc-500">Defina uma nova categoria para organizar produtos.</p>
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
                        <label className={labelClasses}>Slug (URL)</label>
                        <input
                          type="text"
                          required
                          className={inputClasses}
                          placeholder="ex: acessorios"
                          value={categoryForm.slug}
                          onChange={e => setCategoryForm({ ...categoryForm, slug: e.target.value })}
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

                {activeTab === "order" && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-zinc-100 rounded-2xl">
                        <ShoppingCart className="text-black" size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">Pedidos</h2>
                        <p className="text-sm text-zinc-500">Gerencie todos os pedidos e estatus de envio.</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-zinc-200">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-zinc-50 border-b border-zinc-200 text-sm font-medium text-black">
                            <th className="py-3 px-4">Pedido ID</th>
                            <th className="py-3 px-4">Usuário</th>
                            <th className="py-3 px-4">Data</th>
                            <th className="py-3 px-4">Total</th>
                            <th className="py-3 px-4">Status Envio</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-zinc-100">
                          {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
                              <td className="py-3 px-4 text-xs font-mono text-zinc-500">{order.id.split('-')[0]}...</td>
                              <td className="py-3 px-4">
                                <div className="font-medium text-black">{order.user?.name || "Desconhecido"}</div>
                                <div className="text-xs text-zinc-500">{order.user?.email}</div>
                              </td>
                              <td className="py-3 px-4 text-zinc-500">
                                {new Date(order.created_at).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4 font-semibold text-green-700">
                                R$ {Number(order.total_amount).toFixed(2)}
                              </td>
                              <td className="py-3 px-4">
                                {order.shipment ? (
                                  <select
                                    value={order.shipment.status}
                                    onChange={(e) => handleShipmentStatusChange(order.shipment!.id, e.target.value)}
                                    className="text-black px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs outline-none focus:ring-2 focus:ring-black/10 cursor-pointer"
                                  >
                                    <option value="preparing">Preparando</option>
                                    <option value="shipped">Enviado</option>
                                    <option value="delivered">Entregue</option>
                                    <option value="cancelled">Cancelado</option>
                                  </select>
                                ) : (
                                  <span className="text-zinc-400 italic">S/ Envio</span>
                                )}
                              </td>
                            </tr>
                          ))}
                          {orders.length === 0 && (
                            <tr>
                              <td colSpan={5} className="py-6 text-center text-zinc-500">Nenhum pedido encontrado.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === "user" && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-zinc-100 rounded-2xl">
                        <Users className="text-black" size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">Usuários</h2>
                        <p className="text-sm text-zinc-500">Contas registradas no sistema.</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-zinc-200">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-zinc-50 border-b border-zinc-200 text-sm font-medium text-zinc-500">
                            <th className="py-3 px-4">Nome</th>
                            <th className="py-3 px-4">Email</th>
                            <th className="py-3 px-4">Role</th>
                            <th className="py-3 px-4">Data de Criação</th>
                            <th className="py-3 px-4 text-right">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-zinc-100">
                          {users.map((user) => (
                            <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors">
                              <td className="py-3 px-4 font-medium text-black">{user.name}</td>
                              <td className="py-3 px-4 text-zinc-500">{user.email}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded border text-xs font-semibold ${user.role === 'admin' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-zinc-100 border-zinc-200 text-zinc-700'}`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-zinc-500">
                                {new Date(user.created_at).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4 text-right">
                                {currentUser?.id !== user.id ? (
                                  <button
                                    onClick={() => handleUserDelete(user.id)}
                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                    title="Excluir Usuário"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                ) : (
                                  <span className="text-xs text-zinc-400 italic px-2">Você</span>
                                )}
                              </td>
                            </tr>
                          ))}
                          {users.length === 0 && (
                            <tr>
                              <td colSpan={5} className="py-6 text-center text-zinc-500">Nenhum usuário encontrado.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
