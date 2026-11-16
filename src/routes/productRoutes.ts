
import { Router } from "express";
import ProductController from "../controller/ProductController.js";

const router = Router();

/**
 * @openapi
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Listar todos os produtos
 *     description: Retorna todos os produtos cadastrados.
 *     responses:
 *       200:
 *         description: Lista de produtos retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Erro interno ao buscar produtos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", ProductController.getAll);

/**
 * @openapi
 * /products/search:
 *   get:
 *     tags:
 *       - Products
 *     summary: Buscar produtos por palavra-chave
 *     description: Retorna produtos com base em uma palavra-chave.
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         description: Palavra-chave utilizada na pesquisa
 *         schema:
 *           type: string
 *           example: calabresa
 *     responses:
 *       200:
 *         description: Produtos encontrados com sucesso.
 *       500:
 *         description: Erro interno ao buscar produtos.
 */
router.get("/search", ProductController.search);

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Buscar produto por ID
 *     description: Retorna um produto específico pelo seu identificador.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto.
 *     responses:
 *       200:
 *         description: Produto encontrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno ao buscar produto.
 */
router.get("/:id", ProductController.getById);

/**
 * @openapi
 * /products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Criar um produto
 *     description: Cadastra um novo produto.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProduct'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Dados inválidos.
 *       500:
 *         description: Erro interno ao criar produto.
 */
router.post("/", ProductController.create);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     tags:
 *       - Products
 *     summary: Atualizar um produto
 *     description: Atualiza os dados de um produto existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProduct'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno ao atualizar produto.
 */
router.put("/:id", ProductController.update);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     tags:
 *       - Products
 *     summary: Remover um produto
 *     description: Remove um produto pelo seu identificador.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto.
 *     responses:
 *       200:
 *         description: Produto removido com sucesso.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno ao remover produto.
 */
router.delete("/:id", ProductController.remove);

export default router;
