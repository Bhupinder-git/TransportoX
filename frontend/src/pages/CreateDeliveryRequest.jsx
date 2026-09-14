import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { partners } from "../data/partners";
import { saveRequest } from "../services/requestStore";

export default function CreateDeliveryRequest() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    pickup: "",
    delivery: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    notes: "",
  });
  const [selected, setSelected] = useState(partners[0].id);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  function change(event) {
    const { name, value } = event.target;
    const nextValue = ["length", "width", "height"].includes(name)
      ? value.replace(/\D/g, "")
      : value;
    setForm({ ...form, [name]: nextValue });
  }
  function addImages(event) {
    const files = Array.from(event.target.files);
    Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({ name: file.name, data: reader.result });
            reader.readAsDataURL(file);
          }),
      ),
    ).then((next) => setImages((current) => [...current, ...next].slice(0, 6)));
  }
  function submit(event) {
    event.preventDefault();
    if (
      !form.pickup ||
      !form.delivery ||
      !form.weight ||
      !form.length ||
      !form.width ||
      !form.height
    )
      return setError(
        "Please complete the pickup, delivery, weight, and product size fields.",
      );
    if (!images.length)
      return setError("At least one product image is required.");
    const partner = partners.find((item) => item.id === selected);
    saveRequest({
      id: `REQ-${Date.now().toString().slice(-6)}`,
      requester: session.name,
      requesterEmail: session.email,
      partnerId: partner.id,
      partnerName: partner.name,
      ...form,
      images,
      quotedPrice: partner.price,
      quotedEta: partner.eta,
      status: "PENDING_APPROVAL",
      createdAt: new Date().toISOString(),
    });
    navigate("/user/requests");
  }
  return (
    <>
      <div className="user-hero compact-hero">
        <div>
          <div className="eyebrow">NEW DELIVERY REQUEST</div>
          <h1>Plan a delivery</h1>
          <p>
            Tell us what needs to move, then compare trusted delivery partners.
          </p>
        </div>
      </div>
      <form className="request-form" onSubmit={submit}>
        <section className="user-panel">
          <div className="form-section-title">
            <span className="step-number">1</span>
            <div>
              <h2>Delivery details</h2>
              <p>Where should your product be collected and delivered?</p>
            </div>
          </div>
          <div className="form-grid">
            <label>
              Pickup location
              <input
                name="pickup"
                value={form.pickup}
                onChange={change}
                placeholder="Address, warehouse, or postcode"
              />
            </label>
            <label>
              Delivery location
              <input
                name="delivery"
                value={form.delivery}
                onChange={change}
                placeholder="Address, warehouse, or postcode"
              />
            </label>
            <label>
              Package weight (kg)
              <input
                name="weight"
                type="number"
                min="0"
                value={form.weight}
                onChange={change}
                placeholder="e.g. 420"
              />
            </label>
            <label>
              Delivery notes
              <textarea
                name="notes"
                value={form.notes}
                onChange={change}
                placeholder="Handling instructions, access details..."
              />
            </label>
          </div>
        </section>
        <section className="user-panel">
          <div className="form-section-title">
            <span className="step-number">2</span>
            <div>
              <h2>Product size and images</h2>
              <p>
                Images help partners select the right vehicle and handling
                equipment.
              </p>
            </div>
          </div>
          <div className="size-grid">
            <label>
              Length (cm)
              <input
                name="length"
                type="number"
                min="1"
                step="1"
                value={form.length}
                onChange={change}
                placeholder="120"
              />
            </label>
            <label>
              Width (cm)
              <input
                name="width"
                type="number"
                min="1"
                step="1"
                value={form.width}
                onChange={change}
                placeholder="80"
              />
            </label>
            <label>
              Height (cm)
              <input
                name="height"
                type="number"
                min="1"
                step="1"
                value={form.height}
                onChange={change}
                placeholder="100"
              />
            </label>
          </div>
          <label className="upload-box">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={addImages}
            />
            <span className="upload-icon">＋</span>
            <b>{images.length ? `${images.length} image${images.length === 1 ? "" : "s"} selected` : "Upload product images"}</b>
            <small>
              At least one image required · PNG, JPG, or WEBP · Up to 6 images
            </small>
          </label>
          {images.length > 0 && (
            <div className="image-previews">
              {images.map((image, index) => (
                <div key={image.name + index}>
                  <img src={image.data} alt={image.name} />
                  <button
                    type="button"
                    onClick={() =>
                      setImages(
                        images.filter((_, itemIndex) => itemIndex !== index),
                      )
                    }
                  >
                    ×
                  </button>
                  <span>{image.name}</span>
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="user-panel">
          <div className="form-section-title">
            <span className="step-number">3</span>
            <div>
              <h2>Compare delivery partners</h2>
              <p>
                Select the partner that best fits your delivery. Quotes are
                based on your package details.
              </p>
            </div>
          </div>
          <div className="partner-grid">
            {partners.map((partner) => (
              <button
                type="button"
                className={`partner-card ${selected === partner.id ? "selected" : ""}`}
                key={partner.id}
                onClick={() => setSelected(partner.id)}
              >
                <div className="partner-top">
                  <span
                    className="partner-logo"
                    style={{ background: partner.accent }}
                  >
                    {partner.name[0]}
                  </span>
                  <span className="partner-check">
                    {selected === partner.id ? "✓ Selected" : "Select"}
                  </span>
                </div>
                <h3>{partner.name}</h3>
                <div className="partner-rating">
                  ★ {partner.rating} <span>Partner rating</span>
                </div>
                <div className="partner-facts">
                  <div>
                    <small>PRICE</small>
                    <b>₹{partner.price.toLocaleString("en-IN")}</b>
                  </div>
                  <div>
                    <small>ETA</small>
                    <b>{partner.eta}</b>
                  </div>
                  <div>
                    <small>VEHICLES</small>
                    <b>{partner.vehicles}</b>
                  </div>
                  <div>
                    <small>CAPACITY</small>
                    <b>{partner.capacity}</b>
                  </div>
                  <div>
                    <small>INSURANCE</small>
                    <b>{partner.insurance}</b>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
        {error && <div className="form-error">{error}</div>}
        <div className="request-submit">
          <span>
            Selected partner:{" "}
            <b>{partners.find((partner) => partner.id === selected)?.name}</b>
          </span>
          <button className="button primary-button" type="submit">
            Submit delivery request →
          </button>
        </div>
      </form>
    </>
  );
}
