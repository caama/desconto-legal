// Iniciais para avatar sem foto: primeira letra das duas primeiras palavras (ou do e-mail, se não houver nome)
export function getInitials(name?: string | null, fallback = '?') {
  const source = name?.trim() || fallback

  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('')
}

// Fundo em alfa sobre a superfície + texto escuro: legível e discreto
const AVATAR_COLORS = [
  'bg-orange-500/15 text-orange-700',
  'bg-emerald-500/15 text-emerald-700',
  'bg-violet-500/15 text-violet-700',
  'bg-amber-500/15 text-amber-700',
  'bg-rose-500/15 text-rose-700',
  'bg-sky-500/15 text-sky-700',
  'bg-teal-500/15 text-teal-700',
  'bg-fuchsia-500/15 text-fuchsia-700',
]

/**
 * Cor estável para o avatar sem foto, derivada de um identificador.
 * Use o `id`, não o nome: corrigir o nome não deve trocar a cor da pessoa na lista.
 */
export function getAvatarColor(seed: string) {
  const sum = [...seed].reduce((total, char) => total + char.charCodeAt(0), 0)

  return AVATAR_COLORS[sum % AVATAR_COLORS.length] ?? ''
}
