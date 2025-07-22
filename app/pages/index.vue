<script setup lang="ts">
const articlesStore = useArticlesStore();

onMounted(async () => {
  await articlesStore.fetchArticles();
});

const formatDate = (date: string) => {
  const d = new Date(date);
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
};
</script>

<template>
  <main class="container mx-auto my-12">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        Bienvenue sur mon blog
      </h1>
      <p class="text-gray-600">Découvrez mes derniers articles</p>
    </div>

    <!-- Skeleton pendant le chargement -->
    <div
      v-if="articlesStore.loading"
      class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <div v-for="i in 6" :key="i" class="rounded-lg shadow-md p-6">
        <Skeleton class="h-6 w-3/4 mb-4" />
        <Skeleton class="h-4 w-full mb-2" />
        <Skeleton class="h-4 w-5/6 mb-2" />
        <Skeleton class="h-4 w-4/6 mb-4" />
        <div class="flex justify-between items-center">
          <Skeleton class="h-4 w-20" />
          <Skeleton class="h-8 w-24" />
        </div>
      </div>
    </div>

    <!-- Affichage des erreurs -->
    <div v-else-if="articlesStore.error" class="text-center py-12">
      <p class="text-red-500 text-lg">{{ articlesStore.error }}</p>
      <Button @click="articlesStore.fetchArticles()" class="mt-4">
        Réessayer
      </Button>
    </div>

    <!-- Liste des articles -->
    <div
      v-else-if="articlesStore.articles.length > 0"
      class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <Card
        v-for="article in articlesStore.articles"
        :key="article.id"
        class="hover:shadow-lg transition-shadow"
      >
        <CardHeader>
          <CardTitle class="text-xl">{{ article.title }}</CardTitle>
          <CardDescription>
            Publié le {{ formatDate(article.createdAt) }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-gray-600 line-clamp-3">{{ article.excerpt }}</p>
        </CardContent>
      </Card>
    </div>

    <!-- Message si aucun article -->
    <div v-else class="text-center py-12">
      <p class="text-gray-500 text-lg">
        Aucun article disponible pour le moment.
      </p>
    </div>
  </main>
</template>
