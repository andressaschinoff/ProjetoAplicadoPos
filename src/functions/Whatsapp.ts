const linkWhats = (number: string, trollerId: string, name: string) => {
  const defaultLink = `https://wa.me/${number}`;
  const customMessage = `?text=Olá, eu sou @ ${name}. Fiz uma compra pelo Feira na mão, número do pedido ${trollerId}. Por favor, poderia me passar as formas de pagamento.`;
  return `${defaultLink}${customMessage}`;
};

export { linkWhats };
