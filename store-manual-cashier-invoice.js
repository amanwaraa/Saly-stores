
(function(){
  "use strict";
  const clean = v => String(v ?? "").trim();
  const byId = id => document.getElementById(id);
  const asList = v => Array.isArray(v) ? v : (v && typeof v === "object" ? Object.entries(v).map(([k,val]) => ({ ...(val || {}), id: val?.id || k, _key:k })) : []);
  let invoiceCart = [];

  function normalizeHex(value){
    const raw = clean(value || "#cccccc");
    if(/^#[0-9a-fA-F]{6}$/.test(raw)) return raw.toLowerCase();
    if(/^[0-9a-fA-F]{6}$/.test(raw)) return `#${raw.toLowerCase()}`;
    return "#cccccc";
  }
  function matrix(product){
    const rows = asList(product?.variantMatrix);
    if(rows.length){
      return rows.map(r => ({
        size: clean(r.size || r.name || "بدون مقاس") || "بدون مقاس",
        colors: asList(r.colors).map(c => ({
          key: clean(c.key || c.id || `${c.name || "لون"}_${c.code || ""}`),
          name: clean(c.name || c.colorName || "لون") || "لون",
          code: normalizeHex(c.code || c.colorCode || "#cccccc"),
          stock: Math.max(0, Number(c.stock ?? c.qty ?? 0))
        }))
      })).filter(r => r.colors.length);
    }
    const vars = asList(product?.variants);
    if(vars.length){
      return vars.map(v => ({size: clean(v.name || v.size || "بدون مقاس") || "بدون مقاس", colors:[{key:"default", name:"افتراضي", code:"#cccccc", stock:Math.max(0, Number(v.qty ?? v.stock ?? 0))}]}));
    }
    const stock = Math.max(0, Number(product?.stock || product?.inventoryTotal || 0));
    return stock ? [{size:"بدون مقاس", colors:[{key:"default", name:"افتراضي", code:"#cccccc", stock}]}] : [];
  }
  function products(){ return asList(window.productsCache || {}).filter(p => (p.enabled !== false && p.enabled !== "false")); }
  function money(n){ return `${Number(n||0).toFixed(2)} ${window.storeCache?.currencySymbol || "₪"}`; }
  function toast(msg){ return typeof window.toast === "function" ? window.toast(msg) : alert(msg); }

  function fillProducts(){
    const sel = byId("manualStoreProductSelect"); if(!sel) return;
    const list = products();
    sel.innerHTML = `<option value="">اختر المنتج</option>` + list.map(p => `<option value="${String(p.id || p._key)}">${(p.nameAr || p.name || p.titleAr || "منتج").replace(/</g,"&lt;")} - ${(p.barcode || p.cashierBarcode || p.code || "").replace(/</g,"&lt;")}</option>`).join("");
    fillSizes();
  }
  function selectedProduct(){
    const id = clean(byId("manualStoreProductSelect")?.value);
    return products().find(p => String(p.id || p._key) === id) || null;
  }
  function fillSizes(){
    const p = selectedProduct();
    const sizeSel = byId("manualStoreSizeSelect");
    const colorSel = byId("manualStoreColorSelect");
    if(!sizeSel || !colorSel) return;
    const rows = matrix(p || {});
    sizeSel.innerHTML = rows.length ? rows.map(r => `<option value="${r.size.replace(/"/g,'&quot;')}">${r.size.replace(/</g,"&lt;")}</option>`).join("") : `<option value="">لا يوجد مخزون</option>`;
    fillColors();
  }
  function fillColors(){
    const p = selectedProduct();
    const size = clean(byId("manualStoreSizeSelect")?.value);
    const colorSel = byId("manualStoreColorSelect"); if(!colorSel) return;
    const row = matrix(p || {}).find(r => r.size === size);
    const colors = row?.colors || [];
    colorSel.innerHTML = colors.map(c => `<option value="${c.key.replace(/"/g,'&quot;')}" ${Number(c.stock)<=0?'disabled':''}>${c.name.replace(/</g,"&lt;")} - المتوفر ${Number(c.stock||0)}</option>`).join("") || `<option value="">لا توجد ألوان</option>`;
  }
  function renderLines(){
    const box = byId("manualStoreInvoiceLines"); if(!box) return;
    if(!invoiceCart.length){ box.innerHTML = `<div class="text-center text-gray-500 bg-gray-50 rounded-2xl p-4">لا توجد منتجات مضافة</div>`; }
    else {
      box.innerHTML = invoiceCart.map((item,i) => `<div class="flex items-center justify-between gap-3 bg-white border rounded-2xl p-3 flex-wrap"><div><b>${item.name}</b><div class="text-xs text-gray-500">${item.selectedSize} / ${item.selectedColorName} × ${item.qty}</div></div><div class="font-black text-[#14454d]">${money(item.price * item.qty)}</div><button type="button" class="btn btn-danger" onclick="removeManualStoreInvoiceLine(${i})">حذف</button></div>`).join("");
    }
    const total = invoiceCart.reduce((s,i)=>s + Number(i.price||0)*Number(i.qty||1),0);
    if(byId("manualStoreInvoiceTotal")) byId("manualStoreInvoiceTotal").textContent = money(total);
  }

  window.openStoreManualInvoiceModal = function(){
    invoiceCart = [];
    fillProducts();
    renderLines();
    byId("storeManualInvoiceModal")?.classList.remove("hidden");
  };
  window.closeStoreManualInvoiceModal = function(){ byId("storeManualInvoiceModal")?.classList.add("hidden"); };
  window.addManualStoreInvoiceLine = function(){
    const p = selectedProduct();
    if(!p) return toast("اختر المنتج أولاً");
    const size = clean(byId("manualStoreSizeSelect")?.value);
    const colorKey = clean(byId("manualStoreColorSelect")?.value);
    const row = matrix(p).find(r => r.size === size);
    const color = (row?.colors || []).find(c => c.key === colorKey);
    const qty = Math.max(1, Number(byId("manualStoreQtyInput")?.value || 1));
    if(!row || !color) return toast("اختر المقاس واللون");
    if(Number(color.stock || 0) < qty) return toast("المخزون غير كافٍ لهذا اللون والمقاس");
    invoiceCart.push({
      id: clean(p.id || p._key), productId: clean(p.id || p._key),
      name: clean(p.nameAr || p.name || p.titleAr || "منتج متجر"), nameAr: clean(p.nameAr || p.name || p.titleAr || "منتج متجر"),
      price: Number(p.salePrice || p.price || 0), qty, quantity: qty,
      selectedSize: size, selectedVariant: size,
      selectedColorKey: color.key, selectedColorName: color.name, selectedColorCode: color.code,
      barcode: clean(p.barcode || p.cashierBarcode || p.code || ""), cashierBarcode: clean(p.cashierBarcode || p.barcode || p.code || ""), code: clean(p.code || p.barcode || p.cashierBarcode || ""),
      cashierProductKey: clean(p.cashierProductKey || ""), cashierProductId: clean(p.cashierProductId || "")
    });
    renderLines();
  };
  window.removeManualStoreInvoiceLine = function(i){ invoiceCart.splice(i,1); renderLines(); };
  window.submitStoreManualInvoice = async function(){
    if(!invoiceCart.length) return toast("أضف منتجات للفاتورة أولاً");
    if(typeof window.createManualStoreCashierInvoice !== "function") return toast("ملف ربط الكاشير غير محمل");
    if(typeof window.setOverlayLoading === "function") window.setOverlayLoading(true);
    try{
      const res = await window.createManualStoreCashierInvoice(invoiceCart, {customerName: clean(byId("manualStoreCustomerInput")?.value || "عميل متجر"), phone: clean(byId("manualStorePhoneInput")?.value || "")});
      toast(`تم إنشاء فاتورة الكاشير رقم ${res.invoiceId} وخصم المخزون`);
      window.closeStoreManualInvoiceModal();
      if(typeof window.loadAllData === "function") await window.loadAllData();
    }catch(e){ console.error(e); toast(e?.message || "فشل إنشاء فاتورة المتجر في الكاشير"); }
    finally{ if(typeof window.setOverlayLoading === "function") window.setOverlayLoading(false); }
  };
  document.addEventListener("change", e => {
    if(e.target?.id === "manualStoreProductSelect") fillSizes();
    if(e.target?.id === "manualStoreSizeSelect") fillColors();
  });
})();
