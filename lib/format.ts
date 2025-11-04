export function formatCNPJ(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  
  const limited = cleaned.slice(0, 14);

  //logica para formatar cnpj

  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 5) {
    return limited.slice(0, 2) + '.' + limited.slice(2);
  } else if (limited.length <= 8) {
    return limited.slice(0, 2) + '.' + limited.slice(2, 5) + '.' + limited.slice(5);
  } else if (limited.length <= 12) {
    return limited.slice(0, 2) + '.' + limited.slice(2, 5) + '.' + limited.slice(5, 8) + '/' + limited.slice(8);
  } else {
    return limited.slice(0, 2) + '.' + limited.slice(2, 5) + '.' + limited.slice(5, 8) + '/' + limited.slice(8, 12) + '-' + limited.slice(12);
  }
}

export function formatCPF(value: string): string {

  const cleaned = value.replace(/\D/g, '');

  const limited = cleaned.slice(0, 11);

  if (limited.length <= 3) {
    return limited;
  } else if (limited.length <= 6) {
    return limited.slice(0, 3) + '.' + limited.slice(3);
  } else if (limited.length <= 9) {
    return limited.slice(0, 3) + '.' + limited.slice(3, 6) + '.' + limited.slice(6);
  } else {
    return limited.slice(0, 3) + '.' + limited.slice(3, 6) + '.' + limited.slice(6, 9) + '-' + limited.slice(9);
  }
}
