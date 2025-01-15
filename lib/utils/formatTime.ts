export function formatTime(date: string) {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} minuto${minutes === 1 ? '' : 's'} atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hora${hours === 1 ? '' : 's'} atrás`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} dia${days === 1 ? '' : 's'} atrás`;
  const months = Math.floor(days / 30);
  return `${months} mês${months === 1 ? '' : 'es'} atrás`;
}
