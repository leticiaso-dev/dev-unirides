import { Link } from 'react-router-dom'
import Estrelas from './Estrelas.jsx'
import { dataHora, dinheiro } from '../utils.js'

// Cartão de carona usado na busca e no histórico.
// "valor" é o preço por pessoa que será mostrado; "extra" são etiquetas opcionais.
export default function CartaoCarona({ carona, valor, rotuloValor, extra }) {
  return (
    <div className="cartao">
      <div className="rota">
        <span className="ponto">{carona.origem}</span>
        <span className="traco"></span>
        <span className="ponto fim">{carona.destino}</span>
      </div>
      <div className="meta">
        <span>🕒 <b>{dataHora(carona.data_hora)}</b></span>
        <span>💺 <b>{carona.vagas_livres}</b> vaga(s)</span>
        <span>👤 {carona.motorista} · <Estrelas media={carona.nota_motorista.media} /></span>
        <span>🚗 {carona.modelo} {carona.cor}</span>
        {extra}
      </div>
      <div className="rodape-cartao">
        <div className="preco">
          <span>{rotuloValor}</span>
          <b>{dinheiro(valor)}</b>
        </div>
        <Link className="btn pequeno" to={'/carona/' + carona.id}>Ver detalhes</Link>
      </div>
    </div>
  )
}
