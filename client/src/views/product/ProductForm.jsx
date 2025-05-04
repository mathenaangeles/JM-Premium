import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getProduct,
  createProduct,
  updateProduct,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
  addProductImage,
  deleteProductImage
} from '../../slices/productSlice';
import DeleteConfirmationModal from '../../components/DeleteConfirmation';

const ProductForm = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loading, error, success } = useSelector((state) => state.product);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    base_price: null,
    sale_price: null,
    stock: null,
    is_featured: false,
    is_active: true,
    category_id: '', 
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    weight: null,
    width: null,
    height: null,
    depth: null,
    option1_name: '',
    option2_name: '',
    option3_name: '',
    sku: '',
  });

  const [variants, setVariants] = useState([]);
  const [newVariant, setNewVariant] = useState({
    name: '',
    base_price: '',
    sale_price: '',
    stock: '',
    option1_value: '',
    option2_value: '',
    option3_value: '',
    sku: '',
  });

  const [images, setImages] = useState([]);
  const [imageToUpload, setImageToUpload] = useState(null);
  const [isPrimaryImage, setIsPrimaryImage] = useState(false);

  const [variantToDelete, setVariantToDelete] = useState(null);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [showVariantDeleteModal, setShowVariantDeleteModal] = useState(false);
  const [showImageDeleteModal, setShowImageDeleteModal] = useState(false);

  const isEditing = Boolean(productId);

  useEffect(() => {
    if (isEditing) {
      dispatch(getProduct(productId));
    } else {
      resetForm();
    }
  }, [dispatch, productId, isEditing]);

  useEffect(() => {
    if (product && isEditing) {
      setFormData({
        name: product.name || '',
          slug: product.slug || '',
          description: product.description || '',
          base_price: product.base_price !== null ? parseFloat(product.base_price) : null,
          sale_price: product.sale_price !== null ? parseFloat(product.sale_price) : null,
          stock: product.stock !== null ? parseInt(product.stock, 10) : null,
          is_featured: product.is_featured || false,
          is_active: product.is_active || true,
          category_id: product.category_id || '',
          meta_title: product.meta_title || '',
          meta_description: product.meta_description || '',
          meta_keywords: product.meta_keywords || '',
          weight: product.weight !== null ? parseFloat(product.weight) : null,
          width: product.width !== null ? parseFloat(product.width) : null,
          height: product.height !== null ? parseFloat(product.height) : null,
          depth: product.depth !== null ? parseFloat(product.depth) : null,
          option1_name: product.option1_name || '',
          option2_name: product.option2_name || '',
          option3_name: product.option3_name || '',
          sku: product.sku || '',
      });
      setVariants(product.variants || []);
      setImages(product.images || []);
    }
  }, [product, isEditing]);

  useEffect(() => {
    if (success) {
      if (!isEditing) {
        navigate('/manage/products');
      }
    }
  }, [success, navigate, isEditing]);

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      base_price: '',
      sale_price: '',
      stock: '',
      is_featured: false,
      is_active: true,
      category_id: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      weight: '',
      width: '',
      height: '',
      depth: '',
      option1_name: '',
      option2_name: '',
      option3_name: '',
      sku: '',
    });
    setVariants([]);
    setImages([]);
    setNewVariant({
      name: '',
      base_price: '',
      sale_price: '',
      stock: '',
      option1_value: '',
      option2_value: '',
      option3_value: '',
      sku: '',
    });
    setImageToUpload(null);
    setIsPrimaryImage(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;
  
    if (type === 'number') {
      processedValue = value === '' ? null : parseFloat(value);
      if (isNaN(processedValue)) {
        processedValue = null;
      }
    } else if (type === 'checkbox') {
      processedValue = checked;
    } else if (type === 'text' && name === 'sku') {
      processedValue = value === '' ? null : value;
    } else {
      processedValue = value;
    }
  
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: processedValue,
    }));
  };

  const handleNewVariantChange = (e) => {
    const { name, value, _ } = e.target;
    let processedValue = value;

    // Process numeric fields
    if (name === 'base_price' || name === 'sale_price') {
      processedValue = value === '' ? '' : value;
    } else if (name === 'stock') {
      processedValue = value === '' ? '' : value;
    }

    setNewVariant({
      ...newVariant,
      [name]: processedValue
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageToUpload(e.target.files[0]);
    }
  };

  const handleIsPrimaryImageChange = (e) => {
    setIsPrimaryImage(e.target.checked);
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    if (imageToUpload && product) {
      const formData = new FormData();
      formData.append('image', imageToUpload);
      formData.append('is_primary', isPrimaryImage); // Send is_primary flag

      dispatch(addProductImage({
        productId: product.id,
        imageData: formData
      })).then(() => {
        setImageToUpload(null);
        setIsPrimaryImage(false);
      });
    }
  };

  const handleAddVariant = (e) => {
    e.preventDefault();
    const processedVariant = {
      name: newVariant.name,
      base_price: newVariant.base_price !== '' ? parseFloat(newVariant.base_price) : null,
      sale_price: newVariant.sale_price !== '' ? parseFloat(newVariant.sale_price) : null,
      stock: newVariant.stock !== '' ? parseInt(newVariant.stock, 10) : null,
      option1_value: newVariant.option1_value || null,
      option2_value: newVariant.option2_value || null,
      option3_value: newVariant.option3_value || null,
      sku: newVariant.sku || null,
    };
    if (isEditing && product) {
      dispatch(createProductVariant({
        productId: product.id,
        variantData: processedVariant
      })).then(() => {
        setNewVariant({
          name: '',
          base_price: '',
          sale_price: '',
          stock: '',
          option1_value: '',
          option2_value: '',
          option3_value: '',
          sku: '',
        });
      });
    } else {
      setVariants([...variants, { ...processedVariant, id: `temp-${Date.now()}` }]);
      setNewVariant({
        name: '',
        base_price: '',
        sale_price: '',
        stock: '',
        option1_value: '',
        option2_value: '',
        option3_value: '',
        sku: '',
      });
    }
  };

  const handleUpdateVariant = (variant) => {
    const processedVariant = {
      ...variant,
      base_price: variant.base_price !== '' ? parseFloat(variant.base_price) : null,
      sale_price: variant.sale_price !== '' ? parseFloat(variant.sale_price) : null,
      stock: variant.stock !== '' ? parseInt(variant.stock, 10) : null,
      option1_value: variant.option1_value || null,
      option2_value: variant.option2_value || null,
      option3_value: variant.option3_value || null,
      sku: variant.sku || null,
    };

    if (isEditing && product) {
      dispatch(updateProductVariant({
        productId: product.id,
        variantId: processedVariant.id,
        variantData: processedVariant
      }));
    } else {
      setVariants(variants.map(v => (v.id === processedVariant.id ? processedVariant : v)));
    }
  };

  const handleDeleteVariantClick = (variant) => {
    setVariantToDelete(variant);
    setShowVariantDeleteModal(true);
  };

  const confirmDeleteVariant = () => {
    if (variantToDelete) {
      if (isEditing && product) {
        dispatch(deleteProductVariant({
          productId: product.id,
          variantId: variantToDelete.id
        }));
      } else {
        setVariants(variants.filter(v => v.id !== variantToDelete.id));
      }
      setShowVariantDeleteModal(false);
      setVariantToDelete(null);
    }
  };

  const handleDeleteImageClick = (image) => {
    setImageToDelete(image);
    setShowImageDeleteModal(true);
  };

  const confirmDeleteImage = () => {
    if (imageToDelete) {
      dispatch(deleteProductImage(imageToDelete.id));
      setShowImageDeleteModal(false);
      setImageToDelete(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = { ...formData };
    for (const key in productData) {
      if (productData[key] === null || productData[key] === '') {
        delete productData[key];
      }
    }
    
    if (isEditing) {
      dispatch(updateProduct({ productId, productData }));
    } else {
      productData.variants = variants.map(v => ({
        name: v.name,
        base_price: v.base_price !== null ? parseFloat(v.base_price) : null,
        sale_price: v.sale_price !== null && v.sale_price !== '' ? parseFloat(v.sale_price) : null,
        stock: v.stock !== null ? parseInt(v.stock, 10) : null,
        option1_value: v.option1_value || null,
        option2_value: v.option2_value || null,
        option3_value: v.option3_value || null,
        sku: v.sku || null,
      }));
      dispatch(createProduct(productData));
    }
  };

  const generateSlug = () => {
    if (formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');

      setFormData({
        ...formData,
        slug
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Product' : 'Add Product'}</h1>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-6">
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-l"
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="bg-gray-200 text-gray-700 px-4 rounded-r hover:bg-gray-300"
                >
                  Generate
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="base_price" className="block text-sm font-medium text-gray-700 mb-1">
                  Base Price *
                </label>
                <input
                  type="number"
                  id="base_price"
                  name="base_price"
                  value={formData.base_price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label htmlFor="sale_price" className="block text-sm font-medium text-gray-700 mb-1">
                  Sale Price
                </label>
                <input
                  type="number"
                  id="sale_price"
                  name="sale_price"
                  value={formData.sale_price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                Category ID *
              </label>
              <input
                type="number"
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex space-x-4 mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_featured"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                  Featured Product
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-4">Meta Information</h2>
            <div className="mb-4">
              <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                id="meta_title"
                name="meta_title"
                value={formData.meta_title}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                id="meta_description"
                name="meta_description"
                value={formData.meta_description}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="meta_keywords" className="block text-sm font-medium text-gray-700 mb-1">
                Meta Keywords
              </label>
              <input
                type="text"
                id="meta_keywords"
                name="meta_keywords"
                value={formData.meta_keywords}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <h2 className="text-lg font-semibold mb-4">Physical Attributes</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Weight
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-1">
                  Width
                </label>
                <input
                  type="number"
                  id="width"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label htmlFor="depth" className="block text-sm font-medium text-gray-700 mb-1">
                  Depth
                </label>
                <input
                  type="number"
                  id="depth"
                  name="depth"
                  value={formData.depth}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-4">Product Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="option1_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Option 1 Name
                </label>
                <input
                  type="text"
                  id="option1_name"
                  name="option1_name"
                  value={formData.option1_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Color"
                />
              </div>
              <div>
                <label htmlFor="option2_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Option 2 Name
                </label>
                <input
                  type="text"
                  id="option2_name"
                  name="option2_name"
                  value={formData.option2_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Size"
                />
              </div>
              <div>
                <label htmlFor="option3_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Option 3 Name
                </label>
                <input
                  type="text"
                  id="option3_name"
                  name="option3_name"
                  value={formData.option3_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Material"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                SKU
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Right Column */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Images</h2>
            <div className="mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt="Product"
                      className="w-full h-24 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImageClick(image)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                    {image.is_primary && (
                      <div className="absolute bottom-0 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded-tr">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && product && (
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Image
                  </label>
                  <div className="flex items-center space-x-4 mb-2">
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="flex-1 p-2 border rounded"
                      accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={handleAddImage}
                      disabled={!imageToUpload}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      Upload
                    </button>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="is_primary_image"
                      checked={isPrimaryImage}
                      onChange={handleIsPrimaryImageChange}
                      className="mr-2"
                    />
                    <label htmlFor="is_primary_image" className="text-sm font-medium text-gray-700">
                      Set as Primary Image
                    </label>
                  </div>
                </div>
              )}
            </div>

            <h2 className="text-lg font-semibold mb-4">Variants</h2>
            <div className="border rounded-lg p-4 mb-6">
              <div className="mb-4">
                {variants.length > 0 ? (
                  <div className="space-y-2">
                    {variants.map((variant) => (
                      <div key={variant.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex flex-col">
                          <input
                            type="text"
                            value={variant.name}
                            onChange={(e) =>
                              setVariants(variants.map(v => v.id === variant.id ? { ...v, name: e.target.value } : v))
                            }
                            className="text-sm font-medium mb-1 p-1 border rounded"
                            placeholder="Variant Name"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="number"
                              value={variant.base_price}
                              onChange={(e) =>
                                setVariants(variants.map(v => v.id === variant.id ? { ...v, base_price: parseFloat(e.target.value) } : v))
                              }
                              step="0.01"
                              min="0"
                              className="text-sm p-1 border rounded"
                              placeholder="Base Price"
                            />
                            <input
                              type="number"
                              value={variant.sale_price || ''}
                              onChange={(e) =>
                                setVariants(variants.map(v => v.id === variant.id ? { ...v, sale_price: e.target.value ? parseFloat(e.target.value) : null } : v))
                              }
                              step="0.01"
                              min="0"
                              className="text-sm p-1 border rounded"
                              placeholder="Sale Price"
                            />
                            <input
                              type="number"
                              value={variant.stock}
                              onChange={(e) =>
                                setVariants(variants.map(v => v.id === variant.id ? { ...v, stock: parseInt(e.target.value, 10) } : v))
                              }
                              min="0"
                              className="text-sm p-1 border rounded"
                              placeholder="Stock"
                            />
                            <input
                              type="text"
                              value={variant.sku || ''}
                              onChange={(e) =>
                                setVariants(variants.map(v => v.id === variant.id ? { ...v, sku: e.target.value } : v))
                              }
                              className="text-sm p-1 border rounded"
                              placeholder="SKU"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={variant.option1_value || ''}
                              onChange={(e) =>
                                setVariants(variants.map(v => v.id === variant.id ? { ...v, option1_value: e.target.value } : v))
                              }
                              className="text-sm p-1 border rounded"
                              placeholder={`Option 1: ${formData.option1_name || 'Value'}`}
                            />
                            <input
                              type="text"
                              value={variant.option2_value || ''}
                              onChange={(e) =>
                                setVariants(variants.map(v => v.id === variant.id ? { ...v, option2_value: e.target.value } : v))
                              }
                              className="text-sm p-1 border rounded"
                              placeholder={`Option 2: ${formData.option2_name || 'Value'}`}
                            />
                            <input
                              type="text"
                              value={variant.option3_value || ''}
                              onChange={(e) =>
                                setVariants(variants.map(v => v.id === variant.id ? { ...v, option3_value: e.target.value } : v))
                              }
                              className="text-sm p-1 border rounded"
                              placeholder={`Option 3: ${formData.option3_name || 'Value'}`}
                            />
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateVariant(variant)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteVariantClick(variant)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No variants added yet.</p>
                )}

              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Add Variant</h3>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label htmlFor="variant_name" className="block text-xs text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="variant_name"
                      name="name"
                      value={newVariant.name}
                      onChange={handleNewVariantChange}
                      className="w-full p-2 border rounded"
                      placeholder="e.g. Small, Red, etc."
                    />
                  </div>
                  <div>
                    <label htmlFor="variant_base_price" className="block text-xs text-gray-700 mb-1">
                      Base Price
                    </label>
                    <input
                      type="number"
                      id="variant_base_price"
                      name="base_price"
                      value={newVariant.base_price}
                      onChange={handleNewVariantChange}
                      step="0.01"
                      min="0"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label htmlFor="variant_sale_price" className="block text-xs text-gray-700 mb-1">
                      Sale Price
                    </label>
                    <input
                      type="number"
                      id="variant_sale_price"
                      name="sale_price"
                      value={newVariant.sale_price || ''}
                      onChange={handleNewVariantChange}
                      step="0.01"
                      min="0"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label htmlFor="variant_stock" className="block text-xs text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      id="variant_stock"
                      name="stock"
                      value={newVariant.stock}
                      onChange={handleNewVariantChange}
                      min="0"
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div>
                    <label htmlFor="variant_option1_value" className="block text-xs text-gray-700 mb-1">
                      {formData.option1_name || 'Option 1 Value'}
                    </label>
                    <input
                      type="text"
                      id="variant_option1_value"
                      name="option1_value"
                      value={newVariant.option1_value || ''}
                      onChange={handleNewVariantChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label htmlFor="variant_option2_value" className="block text-xs text-gray-700 mb-1">
                      {formData.option2_name || 'Option 2 Value'}
                    </label>
                    <input
                      type="text"
                      id="variant_option2_value"
                      name="option2_value"
                      value={newVariant.option2_value || ''}
                      onChange={handleNewVariantChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label htmlFor="variant_option3_value" className="block text-xs text-gray-700 mb-1">
                      {formData.option3_name || 'Option 3 Value'}
                    </label>
                    <input
                      type="text"
                      id="variant_option3_value"
                      name="option3_value"
                      value={newVariant.option3_value || ''}
                      onChange={handleNewVariantChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="variant_sku" className="block text-xs text-gray-700 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    id="variant_sku"
                    name="sku"
                    value={newVariant.sku || ''}
                    onChange={handleNewVariantChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddVariant}
                  disabled={!newVariant.name || !newVariant.base_price || !newVariant.stock}
                  className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Add Variant
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>

      {showVariantDeleteModal && (
        <DeleteConfirmationModal
          onConfirm={confirmDeleteVariant}
          onCancel={() => setShowVariantDeleteModal(false)}
          message={`Are you sure you want to delete the variant "${variantToDelete?.name}"?`}
        />
      )}

      {showImageDeleteModal && (
        <DeleteConfirmationModal
          onConfirm={confirmDeleteImage}
          onCancel={() => setShowImageDeleteModal(false)}
          message="Are you sure you want to delete this image?"
        />
      )}
    </div>
  );
};

export default ProductForm;