import "../styles/equipamentos.css";
import Sidebar from "../layout/Sidebar";

import {
  Search,
  Plus,
  Wrench,
  CheckCircle,
  Dumbbell,
  Pencil,
  Trash2,
  Info,
  Calendar,
} from "lucide-react";

export default function Equipamentos() {
  return (
    <div className="app-container">
      <Sidebar />

      <main className="equipamentos-page">
        {/* Cabeçalho */}
        <div className="equipamentos-header">
          <div>
            <h1>Equipamentos</h1>
            <p>Gestão de máquinas e manutenção</p>
          </div>

          <button className="btn-novo">
            <Plus size={18} />
            Novo Equipamento
          </button>
        </div>

        {/* Cards */}
        <div className="equipamentos-cards">
          <div className="card-info">
            <div>
              <span>Total de Equipamentos</span>
              <h2>42</h2>
            </div>

            <div className="icon azul">
              <Dumbbell size={24} />
            </div>
          </div>

          <div className="card-info">
            <div>
              <span>Funcionando</span>
              <h2>38</h2>
            </div>

            <div className="icon verde">
              <CheckCircle size={24} />
            </div>
          </div>

          <div className="card-info">
            <div>
              <span>Em Manutenção</span>
              <h2>4</h2>
            </div>

            <div className="icon amarelo">
              <Wrench size={24} />
            </div>
          </div>
        </div>

        {/* Lista Equipamentos */}
        <div className="equipamentos-box">
          <div className="box-header">
            <h2>Lista de Equipamentos</h2>

            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar equipamento..."
              />
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Equipamento</th>
                <th>Código</th>
                <th>Status</th>
                <th>Última Manutenção</th>
                <th>Próxima</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Esteira Profissional</td>
                <td>EST-001</td>
                <td>
                  <span className="status funcionando">
                    Funcionando
                  </span>
                </td>
                <td>15/03/2026</td>
                <td>15/06/2026</td>

                <td className="acoes">
                  <Pencil size={18} />
                  <Trash2 size={18} />
                  <Info size={18} />
                </td>
              </tr>

              <tr>
                <td>Bicicleta Ergométrica</td>
                <td>BIC-001</td>
                <td>
                  <span className="status funcionando">
                    Funcionando
                  </span>
                </td>
                <td>20/02/2026</td>
                <td>20/05/2026</td>

                <td className="acoes">
                  <Pencil size={18} />
                  <Trash2 size={18} />
                  <Info size={18} />
                </td>
              </tr>

              <tr>
                <td>Supino Reto</td>
                <td>SUP-001</td>
                <td>
                  <span className="status manutencao">
                    Manutenção
                  </span>
                </td>
                <td>10/01/2026</td>
                <td>Em andamento</td>

                <td className="acoes">
                  <Pencil size={18} />
                  <Trash2 size={18} />
                  <Info size={18} />
                </td>
              </tr>

              <tr>
                <td>Leg Press 45</td>
                <td>LEG-001</td>
                <td>
                  <span className="status funcionando">
                    Funcionando
                  </span>
                </td>
                <td>05/01/2026</td>
                <td>05/04/2026</td>

                <td className="acoes">
                  <Pencil size={18} />
                  <Trash2 size={18} />
                  <Info size={18} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Histórico */}
        <div className="equipamentos-box">
          <div className="box-header">
            <div>
              <h2>Histórico de Manutenção</h2>
              <p>Últimas manutenções realizadas</p>
            </div>

            <button className="btn-historico">
              <Calendar size={18} />
              Agendar Manutenção
            </button>
          </div>

          <div className="historico-item">
            <div>
              <strong>Esteira Profissional</strong>
              <p>15/03/2026</p>
            </div>

            <span className="tipo preventiva">
              Preventiva
            </span>

            <strong>R$ 350,00</strong>

            <div className="acoes">
              <Pencil size={18} />
              <Trash2 size={18} />
              <Info size={18} />
            </div>
          </div>

          <div className="historico-item">
            <div>
              <strong>Supino Reto</strong>
              <p>10/04/2026</p>
            </div>

            <span className="tipo corretiva">
              Corretiva
            </span>

            <strong>R$ 890,00</strong>

            <div className="acoes">
              <Pencil size={18} />
              <Trash2 size={18} />
              <Info size={18} />
            </div>
          </div>

          <div className="historico-item">
            <div>
              <strong>Hack Squat</strong>
              <p>12/04/2026</p>
            </div>

            <span className="tipo corretiva">
              Corretiva
            </span>

            <strong>R$ 1.200,00</strong>

            <div className="acoes">
              <Pencil size={18} />
              <Trash2 size={18} />
              <Info size={18} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}