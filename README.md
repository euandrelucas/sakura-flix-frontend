# 🌸 SakuraFlix Frontend

[![Deploy](https://img.shields.io/github/actions/workflow/status/euandrelucas/sakura-flix-frontend/deploy.yml?label=build&style=flat-square)](https://github.com/euandrelucas/sakura-flix-frontend/actions)
<!-- [![Deploy](https://img.shields.io/badge/deploy-vercel-000?logo=vercel&style=flat-square)](https://vercel.com/dashboard) -->
[![License](https://img.shields.io/github/license/euandrelucas/sakura-flix-frontend?style=flat-square)](./LICENSE)
[![Author](https://img.shields.io/badge/autor-andrepaiva.dev-blueviolet?style=flat-square)](https://andrepaiva.dev)

> Frontend do SakuraFlix — um serviço de streaming de animes com player avançado, legendas dinâmicas e visual moderno, feito com Next.js e Tailwind.

---

## ✨ Tecnologias Utilizadas

- ⚡ **Next.js 14** – App Router com `src/app/`
- 🎨 **Tailwind CSS** – Estilização rápida e responsiva
- 💻 **TypeScript** – Tipagem estática moderna
- 🎥 **HLS.js** – Suporte a `.m3u8` com legendas
- 📦 **ShadCN UI** – Componentes de UI acessíveis
- 🧩 **Lucide Icons** – Ícones interativos SVG

---

## 🚀 Como rodar localmente

```bash
git clone https://github.com/euandrelucas/sakura-flix-frontend.git
cd sakura-flix-frontend
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador para usar o app.

---

## 📁 Estrutura do Projeto

```
📦 sakura-flix-frontend
├── src/app/               # Rotas e páginas
├── src/components/        # Componentes reutilizáveis
├── src/lib/               # Helpers e funções utilitárias
├── public/            # Arquivos estáticos
└── ...
```

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` com as seguintes variáveis:

```env
NEXT_PUBLIC_API_URL=https://sua-api-privada.com
NEXT_PUBLIC_API_KEY=sua_api_key_privada
```

---

## 💡 Funcionalidades

- ✅ Player com suporte a streaming HLS
- ✅ Múltiplas faixas de legendas por episódio
- ✅ Design totalmente responsivo
- 🚧 Favoritos e Histórico (em desenvolvimento)
- 🚧 Login com backend e contas de usuário

---

## ☁️ Deploy

Você pode fazer o deploy automaticamente via [Vercel](https://vercel.com/). Você pode fazer fork do projeto e implantar com um clique:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/import?s=https://github.com/euandrelucas/sakura-flix-frontend)

---

## 🤝 Contribuições

Sinta-se à vontade para abrir uma issue ou enviar um pull request com melhorias!

```bash
# Fork este repositório
# Crie uma branch com sua feature: git checkout -b minha-feature
# Commit suas mudanças: git commit -m 'feat: nova funcionalidade'
# Push para a branch: git push origin minha-feature
# Abra um Pull Request 🚀
```

---

## 📜 Licença

Distribuído sob a licença MIT. Veja o arquivo [`LICENSE`](./LICENSE) para mais detalhes.

---

## 🙋‍♂️ Autor

Feito com 💖 por [André Paiva](https://andrepaiva.dev)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-André%20Paiva-blue?style=flat-square&logo=linkedin)](https://linkedin.com/in/andrepaivadev)
[![GitHub](https://img.shields.io/badge/GitHub-@andrepaiva.dev-000?style=flat-square&logo=github)](https://github.com/andrepaiva-dev)
