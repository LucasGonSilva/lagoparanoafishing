export type Field =
  | { kind: 'text' | 'textarea' | 'number' | 'datetime' | 'date'; name: string; label: string; required?: boolean; hint?: string; step?: string; defaultValue?: string }
  | { kind: 'select'; name: string; label: string; options: { value: string; label: string }[] }
  | { kind: 'checkbox'; name: string; label: string }
  | { kind: 'image'; name: string; label: string; required?: boolean }
  | { kind: 'photos' | 'videos' | 'sponsors'; name: string; label: string; hint?: string }

export type ResourceConfig = {
  title: string
  singular: string
  hint: string
  createTitle?: string
  fields: Field[]
}

const visible: Field = { kind: 'checkbox', name: 'active', label: 'Visível no site' }
const position: Field = { kind: 'number', name: 'position', label: 'Ordem' }
const slug: Field = { kind: 'text', name: 'slug', label: 'Endereço', hint: 'Deixe em branco para gerar automaticamente.' }

export const resources: Record<string, ResourceConfig> = {
  rules: {
    title: 'Regras',
    singular: 'regra',
    hint: 'O que o grupo combina. A ordem menor aparece primeiro.',
    fields: [
      { kind: 'text', name: 'title', label: 'Título', required: true },
      { kind: 'textarea', name: 'body', label: 'Texto', required: true },
      position,
      visible,
    ],
  },
  events: {
    title: 'Eventos',
    singular: 'evento',
    createTitle: 'Novo evento',
    hint: 'Cada evento entra num ano. Dá para incluir os patrocinadores daquele evento, com nome, foto, site e nota.',
    fields: [
      { kind: 'text', name: 'title', label: 'Título', required: true },
      slug,
      { kind: 'text', name: 'location', label: 'Local' },
      { kind: 'textarea', name: 'summary', label: 'Linha fina', required: true },
      { kind: 'textarea', name: 'body', label: 'Texto' },
      { kind: 'datetime', name: 'starts_at', label: 'Início', required: true },
      { kind: 'datetime', name: 'ends_at', label: 'Término' },
      { kind: 'number', name: 'year', label: 'Ano', required: true, hint: 'Ano em que o evento aparece na lista.' },
      {
        kind: 'select',
        name: 'status',
        label: 'Situação',
        options: [
          { value: 'agendado', label: 'Agendado' },
          { value: 'realizado', label: 'Realizado' },
          { value: 'cancelado', label: 'Cancelado' },
        ],
      },
      { kind: 'image', name: 'image_path', label: 'Imagem', hint: 'Foto principal. No site, o clique amplia.' },
      { kind: 'photos', name: 'photos', label: 'Mais fotos', hint: 'Cada foto abre ampliada no site. JPG, PNG ou WebP.' },
      { kind: 'sponsors', name: 'sponsors', label: 'Patrocinadores', hint: 'Um ou vários. Nome, foto, site e uma nota. A ordem daqui é a ordem no site. Pode ficar sem patrocinador.' },
      visible,
    ],
  },
  species: {
    title: 'Espécies',
    singular: 'espécie',
    hint: 'Fichas dos peixes. Dá para corrigir o texto quando a pescaria pedir.',
    fields: [
      { kind: 'text', name: 'name', label: 'Nome', required: true },
      slug,
      { kind: 'text', name: 'scientific_name', label: 'Nome científico' },
      { kind: 'textarea', name: 'summary', label: 'Linha fina', required: true },
      { kind: 'textarea', name: 'body', label: 'Texto', required: true },
      { kind: 'textarea', name: 'bait', label: 'Isca' },
      { kind: 'text', name: 'period', label: 'Horário' },
      { kind: 'image', name: 'image_path', label: 'Imagem' },
      position,
      visible,
    ],
  },
  posts: {
    title: 'Notícias',
    singular: 'notícia',
    hint: 'Notas do grupo. A data de publicação ordena a lista.',
    fields: [
      { kind: 'text', name: 'title', label: 'Título', required: true },
      slug,
      { kind: 'textarea', name: 'excerpt', label: 'Linha fina', required: true },
      { kind: 'textarea', name: 'body', label: 'Texto', required: true },
      { kind: 'datetime', name: 'published_at', label: 'Publicação' },
      { kind: 'image', name: 'image_path', label: 'Imagem' },
      visible,
    ],
  },
  gallery: {
    title: 'Galeria',
    singular: 'foto',
    hint: 'Cada item é uma foto. JPG, PNG ou WebP, até 8 MB.',
    fields: [
      { kind: 'text', name: 'title', label: 'Título', required: true },
      { kind: 'textarea', name: 'caption', label: 'Legenda' },
      { kind: 'image', name: 'image_path', label: 'Imagem', required: true },
      { kind: 'date', name: 'taken_on', label: 'Data da foto' },
      position,
      visible,
    ],
  },
  products: {
    title: 'Produtos',
    singular: 'produto',
    createTitle: 'Novo produto',
    hint: 'Peças do L.P.F. Sem preço, o site mostra “Sob consulta”.',
    fields: [
      { kind: 'text', name: 'name', label: 'Nome', required: true },
      slug,
      { kind: 'text', name: 'category', label: 'Categoria' },
      { kind: 'number', name: 'edition_year', label: 'Edição', hint: 'Ano em que a peça foi feita. No site aparece como “Edição ano de 2022”. Deixe em branco se não houver edição.' },
      { kind: 'textarea', name: 'summary', label: 'Linha fina', required: true },
      { kind: 'textarea', name: 'body', label: 'Texto', required: true },
      { kind: 'number', name: 'price', label: 'Preço', step: '0.01', hint: 'Deixe em branco para “Sob consulta”.' },
      {
        kind: 'select',
        name: 'availability',
        label: 'Disponibilidade',
        options: [
          { value: 'disponivel', label: 'Disponível' },
          { value: 'sob_encomenda', label: 'Sob encomenda' },
          { value: 'esgotado', label: 'Esgotado' },
        ],
      },
      { kind: 'text', name: 'link', label: 'Link de pedido', hint: 'Endereço completo, começando com https://' },
      { kind: 'image', name: 'image_path', label: 'Imagem' },
      position,
      visible,
    ],
  },
  clients: {
    title: 'Clientes',
    singular: 'pescaria',
    createTitle: 'Nova pescaria',
    hint: 'Saídas embarcadas com clientes do Galegão da Pesca. Local, pescadores, guia, peixes, fotos e vídeos.',
    fields: [
      { kind: 'text', name: 'title', label: 'Nome da pescaria', required: true, hint: 'Como aparece na lista. Ex.: Corumbá IV, manhã.' },
      slug,
      { kind: 'text', name: 'location', label: 'Local', required: true, hint: 'Corumbá IV, Lago Paranoá ou outro ponto.' },
      { kind: 'date', name: 'fished_on', label: 'Data' },
      { kind: 'number', name: 'fish_count', label: 'Quantidade de peixes', hint: 'Deixe em branco se a conta ainda não foi fechada.' },
      { kind: 'textarea', name: 'anglers', label: 'Pescadores', required: true, hint: 'Um nome por linha.' },
      { kind: 'text', name: 'guide', label: 'Guia', defaultValue: 'Galegão da Pesca' },
      { kind: 'textarea', name: 'notes', label: 'Relato' },
      { kind: 'photos', name: 'photos', label: 'Fotos', hint: 'JPG, PNG ou WebP. Pode enviar várias.' },
      { kind: 'videos', name: 'videos', label: 'Vídeos', hint: 'Arquivo MP4, WebM ou MOV de até 80 MB, ou um link https.' },
      position,
      visible,
    ],
  },
  links: {
    title: 'Links',
    singular: 'link',
    createTitle: 'Novo link',
    hint: 'Informações e endereços que ajudam quem pesca. Ex.: carteirinha de pesca, onde emitir documento, regra do lago.',
    fields: [
      { kind: 'text', name: 'title', label: 'Título', required: true },
      { kind: 'textarea', name: 'details', label: 'Informação', hint: 'O que a pessoa precisa saber antes de abrir o link. Deixe em branco se o título bastar.' },
      { kind: 'text', name: 'url', label: 'Link', required: true, hint: 'Endereço completo, começando com https://' },
      position,
      visible,
    ],
  },
  partners: {
    title: 'Parcerias',
    singular: 'parceria',
    createTitle: 'Nova parceria',
    hint: 'Quem apoia o grupo. Nome, texto, site e a marca.',
    fields: [
      { kind: 'text', name: 'name', label: 'Nome', required: true },
      slug,
      { kind: 'textarea', name: 'summary', label: 'Linha fina', required: true },
      { kind: 'textarea', name: 'body', label: 'Texto' },
      { kind: 'text', name: 'url', label: 'Site', hint: 'Endereço completo, começando com https://' },
      { kind: 'image', name: 'image_path', label: 'Marca' },
      position,
      visible,
    ],
  },
  people: {
    title: 'Pessoas',
    singular: 'pessoa',
    createTitle: 'Nova pessoa',
    hint: 'Quem cuida ou colabora com o grupo. Pode haver um ou vários administradores, e outros papéis. O site agrupa pelo papel.',
    fields: [
      { kind: 'text', name: 'name', label: 'Nome', required: true },
      { kind: 'text', name: 'nickname', label: 'Como é conhecido' },
      { kind: 'text', name: 'role', label: 'Papel', required: true, hint: 'Ex.: Administrador, Colaborador. Quem tiver o mesmo papel aparece junto.' },
      { kind: 'textarea', name: 'note', label: 'Nota', hint: 'O que essa pessoa faz no grupo. Deixe em branco se o papel bastar.' },
      position,
      visible,
    ],
  },
  faqs: {
    title: 'Perguntas',
    singular: 'pergunta',
    hint: 'Aparecem na página Participar.',
    fields: [
      { kind: 'text', name: 'question', label: 'Pergunta', required: true },
      { kind: 'textarea', name: 'answer', label: 'Resposta', required: true },
      position,
      visible,
    ],
  },
}

export function itemLabel(item: Record<string, unknown>): string {
  return String(item.title || item.name || item.question || 'Sem título')
}
