import React, { useState } from "react";

const CreateArticleForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    link: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
    setFormData({ title: "", content: "", link: "", image: "" });
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Thêm bài viết mới</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Tiêu đề
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            Nội dung
          </label>
          <textarea
            className="form-control"
            id="content"
            name="content"
            rows="3"
            value={formData.content}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="link" className="form-label">
            Đường dẫn
          </label>
          <input
            type="url"
            className="form-control"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Hình ảnh (URL)
          </label>
          <input
            type="url"
            className="form-control"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">
          Thêm bài viết
        </button>
      </form>
    </div>
  );
};

export default CreateArticleForm;
