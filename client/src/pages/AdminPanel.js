import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: "all",
    sku: "",
    stock: "",
    images: "",
    sizes: "",
    colors: "",
    customizable: false,
    isBestSeller: false,
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    icon: "",
  });

  useEffect(() => {
    fetchCategories();
    if (activeTab === "products") {
      fetchProducts();
    } else if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products?limit=100");
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        images: productForm.images
          ? productForm.images.split(",").map((url) => url.trim())
          : [],
        sizes: productForm.sizes
          ? productForm.sizes.split(",").map((s) => s.trim())
          : [],
        colors: productForm.colors
          ? productForm.colors.split(",").map((c) => c.trim())
          : [],
      };

      await axios.post("/api/products", productData);
      setMessage("Product added successfully!");
      setProductForm({
        name: "",
        description: "",
        price: "",
        category: "",
        subcategory: "all",
        sku: "",
        stock: "",
        images: "",
        sizes: "",
        colors: "",
        customizable: false,
        isBestSeller: false,
      });
      fetchProducts();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post("/api/categories", categoryForm);
      setMessage("Category added successfully!");
      setCategoryForm({ name: "", description: "", icon: "" });
      fetchCategories();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`/api/products/${id}`);
      setMessage("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      setMessage("Failed to delete product");
    }
  };

  return (
    <div className="admin-panel">
      <div className="container">
        <h1 className="page-title">Admin Control Panel</h1>

        {message && (
          <div className={message.includes("success") ? "success" : "error"}>
            {message}
          </div>
        )}

        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
          <button
            className={`tab-btn ${activeTab === "add-product" ? "active" : ""}`}
            onClick={() => setActiveTab("add-product")}
          >
            Add Product
          </button>
          <button
            className={`tab-btn ${activeTab === "categories" ? "active" : ""}`}
            onClick={() => setActiveTab("categories")}
          >
            Add Category
          </button>
          <button
            className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
        </div>

        <div className="admin-content">
          {/* Products List */}
          {activeTab === "products" && (
            <div className="products-table-container">
              <h2>All Products ({products.length})</h2>
              <div className="products-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>SKU</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Category</th>
                      <th>Best Seller</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>{product.name}</td>
                        <td>{product.sku || "-"}</td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>{product.stock}</td>
                        <td>{product.category?.name || "-"}</td>
                        <td>{product.isBestSeller ? "⭐" : "-"}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add Product Form */}
          {activeTab === "add-product" && (
            <div className="admin-form-container">
              <h2>Add New Product</h2>
              <form onSubmit={handleProductSubmit} className="admin-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm({ ...productForm, name: e.target.value })
                      }
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>SKU</label>
                    <input
                      type="text"
                      value={productForm.sku}
                      onChange={(e) =>
                        setProductForm({ ...productForm, sku: e.target.value })
                      }
                      className="input-field"
                      placeholder="e.g., TSH-001"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        description: e.target.value,
                      })
                    }
                    className="input-field"
                    rows="4"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price * ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          price: e.target.value,
                        })
                      }
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock *</label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          stock: e.target.value,
                        })
                      }
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          category: e.target.value,
                        })
                      }
                      className="input-field"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>For</label>
                    <select
                      value={productForm.subcategory}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          subcategory: e.target.value,
                        })
                      }
                      className="input-field"
                    >
                      <option value="all">All</option>
                      <option value="kids">Kids</option>
                      <option value="mens">Mens</option>
                      <option value="womens">Womens</option>
                      <option value="school-girls">School Girls</option>
                      <option value="college-girls">College Girls</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Image URLs (comma separated)</label>
                  <input
                    type="text"
                    value={productForm.images}
                    onChange={(e) =>
                      setProductForm({ ...productForm, images: e.target.value })
                    }
                    className="input-field"
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Sizes (comma separated)</label>
                    <input
                      type="text"
                      value={productForm.sizes}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          sizes: e.target.value,
                        })
                      }
                      className="input-field"
                      placeholder="XS, S, M, L, XL, XXL, One Size"
                    />
                    <small style={{ color: "#666", fontSize: "12px" }}>
                      Valid values only: XS, S, M, L, XL, XXL, One Size
                    </small>
                  </div>

                  <div className="form-group">
                    <label>Colors (comma separated)</label>
                    <input
                      type="text"
                      value={productForm.colors}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          colors: e.target.value,
                        })
                      }
                      className="input-field"
                      placeholder="Red, Blue, Green"
                    />
                  </div>
                </div>

                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={productForm.customizable}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          customizable: e.target.checked,
                        })
                      }
                    />
                    <span>Customizable</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={productForm.isBestSeller}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          isBestSeller: e.target.checked,
                        })
                      }
                    />
                    <span>Mark as Best Seller</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Product"}
                </button>
              </form>
            </div>
          )}

          {/* Add Category Form */}
          {activeTab === "categories" && (
            <div className="admin-form-container">
              <h2>Add New Category</h2>
              <form onSubmit={handleCategorySubmit} className="admin-form">
                <div className="form-group">
                  <label>Category Name *</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, name: e.target.value })
                    }
                    className="input-field"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        description: e.target.value,
                      })
                    }
                    className="input-field"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Icon (emoji or URL)</label>
                  <input
                    type="text"
                    value={categoryForm.icon}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, icon: e.target.value })
                    }
                    className="input-field"
                    placeholder="🎨 or icon URL"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Category"}
                </button>

                {/* Users List */}
                {activeTab === "users" && (
                  <div className="products-table-container">
                    <h2>Registered Users ({users.length})</h2>
                    <div className="products-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Admin</th>
                            <th>Registered</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user._id}>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>{user.phone || "-"}</td>
                              <td>{user.isAdmin ? "✓ Admin" : "User"}</td>
                              <td>
                                {new Date(user.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </form>

              <div className="existing-categories">
                <h3>Existing Categories</h3>
                <div className="categories-list">
                  {categories.map((cat) => (
                    <div key={cat._id} className="category-item">
                      <span className="category-icon">{cat.icon}</span>
                      <span className="category-name">{cat.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
