<script setup lang="ts">
import { ref } from "vue";
import { useArticlesStore } from "@/stores/articles";
import { useAuthStore } from "@/stores/auth";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import * as z from "zod";

const articlesStore = useArticlesStore();
const authStore = useAuthStore();
const router = useRouter();
const editArticleId = ref<string | null>(null);

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push("/");
  }
  await articlesStore.fetchArticles();
});

const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(2, "Le titre est requis"),
    excerpt: z.string().min(2, "L'extrait est requis"),
    content: z.string().min(2, "Le contenu est requis"),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

// Quand on ouvre la modale d'édition, on pré-remplit le form
const openEditDialog = (article) => {
  console.log(article.id);
  editArticleId.value = article.id;
};

const handleDelete = async (id: number) => {
  await articlesStore.deleteArticle(id);
};

const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

const submitCreateArticle = form.handleSubmit(async (values) => {
  await articlesStore.createArticle(values);
});

const submitUpdateArticle = form.handleSubmit(async (values) => {
  await articlesStore.updateArticle(editArticleId.value, values);
});
</script>

<template>
  <main class="container mx-auto my-12">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        Gestion des Articles
      </h1>
      <p class="text-gray-600">Ajoutez, modifiez ou supprimez vos articles</p>
    </div>

    <!-- Bouton pour ajouter un nouvel article -->
    <div class="mb-6">
      <Dialog>
        <DialogTrigger as-child>
          <Button class="mb-4">+ Nouvel Article</Button>
        </DialogTrigger>
        <DialogContent
          class="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Nouvel article</DialogTitle>
          </DialogHeader>
          <form @submit="submitCreateArticle">
            <FormField v-slot="{ componentField }" name="title">
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Titre"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="excerpt">
              <FormItem>
                <FormLabel>Extrait</FormLabel>
                <FormControl>
                  <Textarea
                    rows="3"
                    placeholder="Extrait"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="content">
              <FormItem>
                <FormLabel>Contenu</FormLabel>
                <FormControl>
                  <Textarea
                    rows="10"
                    placeholder="Contenu"
                    v-bind="componentField"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <DialogFooter class="flex space-x-2">
              <Button
                type="submit"
                class="flex-1"
                :disabled="articlesStore.formLoading"
              >
                {{ articlesStore.formLoading ? "Création..." : "Créer" }}
              </Button>
              <DialogClose as-child>
                <Button type="button" variant="outline">Annuler</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    <!-- Skeleton pendant le chargement -->
    <div v-if="articlesStore.loading" class="space-y-4">
      <Card v-for="i in 5" :key="i">
        <CardHeader>
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <Skeleton class="h-6 w-3/4 mb-2" />
              <Skeleton class="h-4 w-1/2" />
            </div>
            <div class="flex space-x-2">
              <Skeleton class="h-8 w-16" />
              <Skeleton class="h-8 w-16" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton class="h-4 w-full mb-2" />
          <Skeleton class="h-4 w-5/6" />
        </CardContent>
      </Card>
    </div>

    <!-- Affichage des erreurs -->
    <div v-else-if="articlesStore.error" class="text-center py-12">
      <p class="text-red-500 text-lg">{{ articlesStore.error }}</p>
      <Button @click="articlesStore.fetchArticles()" class="mt-4"
        >Réessayer</Button
      >
    </div>

    <!-- Liste des articles existants -->
    <div v-else class="space-y-4">
      <Card v-for="article in articlesStore.articles" :key="article.id">
        <CardHeader>
          <div class="flex justify-between items-start">
            <div>
              <CardTitle>{{ article.title }}</CardTitle>
              <CardDescription
                >Publié le {{ formatDate(article.createdAt) }}</CardDescription
              >
            </div>
            <div class="flex space-x-2">
              <!-- Dialog pour édition -->
              <Dialog>
                <DialogTrigger as-child>
                  <Button
                    variant="outline"
                    size="sm"
                    @click="openEditDialog(article)"
                    >Modifier</Button
                  >
                </DialogTrigger>
                <DialogContent
                  class="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
                >
                  <DialogHeader>
                    <DialogTitle>Modifier l'article</DialogTitle>
                  </DialogHeader>
                  <form @submit="submitUpdateArticle">
                    <FormField v-slot="{ componentField }" name="title">
                      <FormItem>
                        <FormLabel>Titre</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Titre"
                            v-bind="componentField"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="excerpt">
                      <FormItem>
                        <FormLabel>Extrait</FormLabel>
                        <FormControl>
                          <Textarea
                            rows="3"
                            placeholder="Extrait"
                            v-bind="componentField"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="content">
                      <FormItem>
                        <FormLabel>Contenu</FormLabel>
                        <FormControl>
                          <Textarea
                            rows="10"
                            placeholder="Contenu"
                            v-bind="componentField"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                    <DialogFooter class="flex space-x-2">
                      <Button
                        type="submit"
                        class="flex-1"
                        :disabled="articlesStore.formLoading"
                      >
                        {{
                          articlesStore.formLoading
                            ? "Sauvegarde..."
                            : "Enregistrer"
                        }}
                      </Button>
                      <DialogClose as-child>
                        <Button type="button" variant="outline">Annuler</Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="sm"
                class="text-red-600 hover:text-red-700"
                :disabled="articlesStore.formLoading"
                @click="handleDelete(article.id)"
              >
                Supprimer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p class="text-gray-600">{{ article.excerpt }}</p>
        </CardContent>
      </Card>
    </div>
  </main>
</template>
