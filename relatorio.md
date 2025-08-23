<sup>Esse é um feedback gerado por IA, ele pode conter erros.</sup>

Você tem 9 créditos restantes para usar o sistema de feedback AI.

# Feedback para gabubits:

Nota final: **48.7/100**

Olá, gabubits! 👋🚀

Antes de mais nada, parabéns pelo esforço e pelo que você já conseguiu implementar até aqui! 🎉 Seu projeto tem uma estrutura organizada, você aplicou corretamente o uso de middlewares para autenticação, implementou hashing de senhas com bcrypt, e também gerou tokens JWT com expiração, o que é essencial para a segurança da aplicação. Além disso, vi que você se preocupou em validar entradas com Zod, o que é uma ótima prática para garantir a integridade dos dados! 👏

---

## 🎯 Pontos Fortes que Merecem Destaque

- **Estrutura do projeto** está bem alinhada com o esperado, com pastas claras para controllers, repositories, rotas, middlewares e utils.
- **Middleware de autenticação** (`authMiddleware.js`) está implementado para proteger rotas sensíveis.
- **Controllers de autenticação** (`authController.js`) fazem o registro, login, logout e exclusão de usuários com o uso correto de bcrypt e JWT.
- Você usou o **Zod para validação dos dados**, o que ajuda a evitar erros e garante que os dados estejam no formato esperado.
- O arquivo **INSTRUCTIONS.md** está bem detalhado, orientando sobre o fluxo de autenticação e uso do token JWT.
- Você implementou corretamente o **hash de senha** e a geração do token JWT com expiração.
- As rotas de agentes e casos estão protegidas pelo middleware de autenticação, garantindo segurança.

Além disso, parabéns por ter avançado em alguns bônus, como a filtragem por status, busca por casos e agentes, e até a criação do endpoint `/usuarios/me` para retornar dados do usuário autenticado — isso mostra que você está indo além! 🌟

---

## 🕵️‍♂️ Análise dos Pontos que Precisam de Atenção e Como Corrigi-los

### 1. **Erro 400 ao criar usuário com campo extra**

Você implementou a validação com Zod para o esquema de usuário, mas parece que o esquema `usuarioRegSchema` está permitindo campos extras no corpo da requisição. Isso faz com que, se o cliente enviar campos que não são esperados, o servidor não retorne erro 400, ou o faça de forma inconsistente.

**Por quê isso é importante?**  
Permitir campos extras pode abrir brechas para dados inesperados e dificultar a manutenção da API. Além disso, o requisito exige que campos extras causem erro 400.

**Como corrigir?**  
Na definição do seu schema Zod, você precisa especificar que não são permitidos campos extras, usando `.strict()`:

```js
import { z } from "zod";

export const usuarioRegSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  senha: z.string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/[a-z]/, "Senha deve conter letra minúscula")
    .regex(/[A-Z]/, "Senha deve conter letra maiúscula")
    .regex(/[0-9]/, "Senha deve conter número")
    .regex(/[\W_]/, "Senha deve conter caractere especial"),
}).strict(); // <-- Aqui está o ponto crucial
```

Com `.strict()`, qualquer campo extra fará a validação falhar, retornando erro 400.

### 2. **Retorno incorreto do token JWT no login**

No seu `authController.js`, você gera o token com:

```js
const token = jwt.sign(usuario_existe, process.env.JWT_SECRET, {
  expiresIn: "1d",
});
```

E retorna:

```js
res.status(200).json({
  acess_token: token,
});
```

Aqui o token está sendo retornado com a chave `"acess_token"`, que está correta conforme o enunciado. Porém, recomendo confirmar se a variável de ambiente `JWT_SECRET` está definida corretamente no `.env` e carregada no seu processo (via `dotenv.config()`), pois qualquer problema aqui pode invalidar o token.

Além disso, no payload do JWT, você está passando o objeto completo `usuario_existe`, que inclui a senha hasheada. Isso não é uma boa prática de segurança.

**Como melhorar?**  
Extraia apenas os dados necessários para o token (exemplo: id, nome e email):

```js
const payload = {
  id: usuario_existe.id,
  nome: usuario_existe.nome,
  email: usuario_existe.email,
};

const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
```

Isso evita expor a senha no token, mesmo que esteja hasheada.

### 3. **Falha ao atualizar e deletar agentes e casos com IDs inválidos**

Nos seus repositórios (`agentesRepository.js` e `casosRepository.js`), as funções de atualização e exclusão estão assim:

```js
const result = await db("agentes").where({ id }).update(dados, "*");
return result.length ? result[0] : undefined;
```

e

```js
const result = await db("agentes").where({ id }).del("*");
return result.length ? true : false;
```

O problema aqui é que o método `.update()` e `.del()` do Knex retornam o número de linhas afetadas (um número), não um array. Portanto, `result.length` será `undefined` e a condição não funciona como esperado, fazendo com que o retorno seja sempre `undefined` ou `false`, mesmo quando a operação foi bem-sucedida.

**Como corrigir?**

- Para `.update()`, você pode usar `.returning("*")` para obter os dados atualizados (funciona no PostgreSQL).
- Para `.del()`, o retorno é o número de linhas deletadas.

Exemplo corrigido para `atualizarAgente`:

```js
export async function atualizarAgente(id, dados) {
  const result = await db("agentes").where({ id }).update(dados).returning("*");
  return result.length ? result[0] : undefined;
}
```

Para `apagarAgente`:

```js
export async function apagarAgente(id) {
  const result = await db("agentes").where({ id }).del();
  return result > 0;
}
```

Essa mesma correção vale para os métodos nos repositórios de `casos` e `usuarios`.

### 4. **Middleware de autenticação e tratamento de erros**

No seu `authMiddleware.js`, você está usando `jwt.verify` com callback, e dentro do callback, se houver erro, você lança uma exceção:

```js
jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
  if (error) {
    throw new Errors.TokenError({
      token: "Token inválido",
    });
  }
  req.user = decoded;
  return next();
});
```

O problema é que lançar um erro dentro do callback não é capturado pelo `try/catch` externo, pois o callback é assíncrono. Isso pode fazer com que erros de token inválido não sejam tratados corretamente e causem falha silenciosa.

**Como corrigir?**

Use a versão síncrona de `jwt.verify` ou transforme o middleware em assíncrono para usar `try/catch` corretamente.

Exemplo usando versão síncrona:

```js
export function authMiddleware(req, res, next) {
  try {
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader && tokenHeader.split(" ")[1];

    if (!token) {
      throw new Errors.TokenError({ token: "Token não encontrado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (e) {
    if (e.name === "JsonWebTokenError" || e.name === "TokenExpiredError") {
      return next(new Errors.TokenError({ token: "Token inválido ou expirado" }));
    }
    next(e);
  }
}
```

Assim o erro será capturado e passado para o middleware de erro corretamente, retornando o status 401 esperado.

### 5. **Migration de rollback vazia**

No arquivo `db/migrations/20250822143501_usuarios.js`, você criou a migration para a tabela `usuarios`, mas o método `down` está vazio:

```js
export async function down(knex) {}
```

Isso significa que não há como desfazer a criação da tabela, o que pode causar problemas em ambientes de testes e desenvolvimento.

**Como corrigir?**

Implemente o método `down` para dropar a tabela:

```js
export async function down(knex) {
  await knex.schema.dropTableIfExists("usuarios");
}
```

Isso ajuda a manter a consistência e permite rodar `knex migrate:rollback` quando necessário.

---

## ✨ Recomendações de Aprendizado

Para te ajudar a entender e corrigir os pontos acima, recomendo fortemente os seguintes vídeos:

- **Autenticação e Segurança com JWT e bcrypt:**  
  [Esse vídeo, feito pelos meus criadores, fala muito bem sobre os conceitos básicos e fundamentais da cibersegurança.](https://www.youtube.com/watch?v=Q4LQOfYwujk)

- **JWT na prática:**  
  [Vídeo excelente para entender como gerar, validar e usar tokens JWT corretamente.](https://www.youtube.com/watch?v=keS0JWOypIU)

- **Uso de bcrypt e JWT juntos:**  
  [Esse vídeo explica detalhadamente o uso combinado de bcrypt para hashing e JWT para autenticação.](https://www.youtube.com/watch?v=L04Ln97AwoY)

- **Knex Query Builder - Atualizações e Deleções:**  
  [Guia detalhado do Knex Query Builder para entender os métodos `.update()`, `.del()`, e `.returning()`.](https://www.youtube.com/watch?v=GLwHSs7t3Ns&t=4s)

- **Validação com Zod e `.strict()`:**  
  Embora não tenha um vídeo específico, a documentação oficial do Zod explica o uso do `.strict()`. Vale a pena dar uma olhada aqui: https://github.com/colinhacks/zod#strict-validation

---

## 📋 Resumo dos Pontos para Focar

- Use `.strict()` no schema Zod para impedir campos extras no registro de usuários.
- Ajuste os métodos `.update()` e `.del()` nos repositories para usar `.returning()` e verificar o número de linhas afetadas corretamente.
- Corrija o middleware de autenticação para capturar erros JWT de forma síncrona e evitar erros não tratados.
- No JWT, evite incluir a senha do usuário no payload do token.
- Implemente o método `down` nas migrations para garantir rollback.
- Confirme que a variável de ambiente `JWT_SECRET` está corretamente configurada e carregada.

---

Gabubits, seu projeto está no caminho certo e com algumas correções ficará ainda mais sólido e profissional! 🚀 Continue praticando essas boas práticas, porque segurança e organização são fundamentais para APIs robustas.

Se precisar, volte aos vídeos que recomendei para aprofundar seu entendimento e não hesite em experimentar as correções no seu código.

Você está fazendo um trabalho incrível, continue assim! 💪✨

Um abraço do seu Code Buddy! 🤖💙

> Caso queira tirar uma dúvida específica, entre em contato com o Chapter no nosso [discord](https://discord.gg/DryuHVnz).



---
<sup>Made By the Autograder Team.</sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Carvalho](https://github.com/ArthurCRodrigues)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Drumond](https://github.com/drumondpucminas)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Gabriel Resende](https://github.com/gnvr29)</sup></sup>