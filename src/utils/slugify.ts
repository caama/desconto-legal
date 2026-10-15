// Gera um slug compatível com a regra do formulário de empresa: apenas letras minúsculas e hífens.
// Números não são aceitos pela regra; palavras como "24h" são descartadas em vez de virarem um "h" solto.
export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/[\s-]+/)
    .map(word => {
      const letters = word.replace(/[^a-z]/g, '')
      return /\d/.test(word) && letters.length < 2 ? '' : letters
    })
    .filter(Boolean)
    .join('-')
}
