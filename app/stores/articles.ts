import { defineStore } from "pinia";
import type {
  Article,
  CreateArticleData,
  UpdateArticleData,
} from "@/types/articleTypes";

// @ts-ignore
export const useArticlesStore = defineStore("articles", {
  state: () => ({
    articles: [] as Article[],
    loading: false,
    formLoading: false,
  }),
  actions: {
    async fetchArticles() {
      this.loading = true;
      try {
        const { $api } = useNuxtApp();
        const response = (await $api("/articles")) as {
          data: { articles: Article[] };
        };
        this.articles = response.data.articles ?? [];
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },
    // async fetchArticle(id: number) {
    //   this.loading = true;
    //     const { $api } = useNuxtApp();
    //   try {
    //     const response = await $api(`/articles/${id}`);
    //     return response as Article;
    //   } catch (error) {
    //     throw error;
    //   } finally {
    //     this.loading = false;
    //   }
    // },
    async createArticle(articleData: CreateArticleData) {
      this.formLoading = true;
      const { $api } = useNuxtApp();
      try {
        const response = await $api("/articles", {
          method: "POST",
          body: articleData,
        });
        return response;
      } catch (error) {
        throw error;
      } finally {
        this.formLoading = false;
      }
    },
    async updateArticle(id: number, articleData: UpdateArticleData) {
      this.formLoading = true;
      const { $api } = useNuxtApp();
      try {
        const response = await $api<Article>(`/articles/${id}`, {
          method: "PUT",
          body: articleData,
        });
        return response;
      } catch (error) {
        throw error;
      } finally {
        this.formLoading = false;
      }
    },
    async deleteArticle(id: number) {
      this.formLoading = true;
      const { $api } = useNuxtApp();
      try {
        await $api(`/articles/${id}`, { method: "DELETE" });
        // Remove the deleted product from the local state
        this.articles = this.articles.filter((article) => article.id !== id);
      } catch (error) {
        throw error;
      } finally {
        this.formLoading = false;
      }
    },
  },
  persist: true,
});
