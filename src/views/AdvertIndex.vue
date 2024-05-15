<script setup lang="ts">
import Dropdown from "primevue/dropdown";
import Paginator, { type PageState } from "primevue/paginator";
import AdvertsTable from "@/components/AdvertsTable.vue";
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import { api } from "@/api";
import { computed, ref, watch } from "vue";

const loading = ref(false);
const fetchingError = ref(false);
const tableData = ref<Advert[]>([]);
const total = ref(0);
const page = ref(1);
const firstRow = ref(0);
const scrollTarget = ref<HTMLElement | null>(null);

const selectedSort = ref({ name: "Свежие", code: "default" });
const sort = ref([
    { name: "Свежие", code: "default" },
    { name: "Ранние", code: "older" },
    { name: "Дешевле", code: "lowprice" },
    { name: "Дороже", code: "hiprice" },
]);

const queryParams = computed(() => {
    const query: Query = {};

    if (selectedSort.value.code !== "default") {
        query.sort = selectedSort.value.code;
    }

    if (page.value > 1) {
        query.page = page.value;
    }

    return query;
});

getAdverts();

watch(queryParams, () => getAdverts(queryParams.value));
watch(selectedSort, () => resetPage());

async function getAdverts(query?: Query) {
    loading.value = true;
    fetchingError.value = false;

    try {
        const params = query || {};
        const response = await api.get("/adverts", { params });
        tableData.value = response.data?.data || [];
        total.value = response.data?.meta?.total || 0;
    } catch (error) {
        fetchingError.value = true;
    }

    loading.value = false;
}

function resetPage() {
    page.value = 1;
    firstRow.value = 0;
}

function changePage(event: PageState) {
    page.value = event.page + 1;
    scrollUp();
}

function scrollUp() {
    setTimeout(() => {
        if (scrollTarget?.value) {
            scrollTarget.value.scrollIntoView({ behavior: "smooth" });
        }
    }, 0);
}
</script>

<template>
    <div>
        <LoadingIndicator v-if="loading" />
        <div ref="scrollTarget" class="head">
            <h1>Объявления</h1>
            <Dropdown v-model="selectedSort" :options="sort" optionLabel="name" class="dropdown" />
        </div>

        <div class="adverts">
            <hr />
            <template v-for="advert in tableData" :key="advert.id">
                <AdvertsTable :advert="advert" />
                <hr />
            </template>
        </div>

        <Paginator
            @page="changePage"
            :rows="10"
            :totalRecords="total"
            v-model:first="firstRow"
            class="paginator"
        ></Paginator>
    </div>
</template>

<style>
.date {
    width: 10rem;
    max-width: 10rem;
}
</style>

<style scoped lang="scss">
.head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
}

.dropdown {
    height: 2.3rem;
    width: 12rem;
    line-height: 100%;
    opacity: 0.7;
}

hr {
    border: none;
    border-bottom: 1px solid #f0f0f0;
    margin: 0 1rem;
}

.paginator {
    margin-top: 1.5rem;
}
</style>
