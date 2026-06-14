/**
 * 以隱藏 form 整頁 POST 導轉綠界 cashier。
 */
export function submitEcpayForm(
  actionUrl: string,
  params: Record<string, string>,
): void {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = actionUrl;
  form.acceptCharset = "UTF-8";

  for (const [name, value] of Object.entries(params)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}
