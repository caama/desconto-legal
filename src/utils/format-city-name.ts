// Nomes de cidade são exibidos e gravados sempre em maiúsculas (ex.: "Buriticupu" -> "BURITICUPU")
export function formatCityName(name: string) {
  return name.trim().toLocaleUpperCase('pt-BR')
}
