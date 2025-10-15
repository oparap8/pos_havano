frappe.ui.form.on("Item", {
  item_group(frm) {
    displayMenuCategory(frm);
  },
  refresh(frm) {
    displayMenuCategory(frm);
  },
});

async function displayMenuCategory(frm) {
  if (!frm.doc.item_group) return;

  const item_group = await frappe.db.get_single_value(
    "Sample Pos Settings",
    "menu_item_group"
  );
  
  frm.set_df_property(
    "custom_menu_category",
    "hidden",
    frm.doc.item_group !== item_group
  );
}
