<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { api } from "@/api";
import { ref } from "vue";
import { useRoute } from "vue-router";

const id = useRoute().params.id;
const loading = ref(false);
const fetchingError = ref(false);

const advert = ref<AdvertDetail>();

getAdvert();

async function getAdvert() {
    loading.value = true;
    fetchingError.value = false;

    try {
        const params = { fields: "descr,photos" };
        const response = await api.get(`/adverts/${id}`, { params });
        advert.value = response.data?.data || [];
    } catch (error) {
        fetchingError.value = true;
    }

    loading.value = false;
}
</script>

<template>
    <div>
        <div class="head">
            <template v-if="advert">
                <div class="swiper-wrapper">
                    <Swiper
                        class="main-gallery"
                        id="swp1"
                        :spaceBetween="90"
                        :navigation="true"
                        :pagination="{ clickable: true }"
                        :centeredSlidesBounds="true"
                        :modules="[Navigation, Pagination]"
                    >
                        <SwiperSlide v-for="(item, index) in advert.photos" :key="index">
                            <img :src="item" :alt="advert.name" />
                        </SwiperSlide>
                    </Swiper>
                </div>
            </template>
            <div class="right-wrapper">
                <h1>{{ advert?.name }}</h1>
                <h2>{{ advert?.price.toLocaleString("ru-RU") }} ₽</h2>
            </div>
        </div>
        <p class="description">{{ advert?.description }}</p>
    </div>
</template>

<style>
.swiper-pagination-bullet {
    outline: 2px solid rgb(48, 48, 48) !important;
    opacity: 0.6;
}
.swiper-pagination-bullet-active {
    opacity: 1;
}
</style>

<style scoped lang="scss">
.head {
    display: flex;
    gap: 2rem;
    margin-bottom: 1rem;
    width: 100%;
    max-width: 100%;
}
.right-wrapper {
    margin-top: 1rem;
}
.swiper-wrapper {
    height: 500px;
    width: 100%;
    max-width: 800px;
}
.main-gallery {
    --swiper-navigation-color: #000;
    --swiper-pagination-color: #aaa;
    --swiper-pagination-bullet-inactive-color: #aaa;
    text-align: center;
    height: 100%;
    padding: 0 70px;

    .swiper-slide {
        height: 100%;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 0.5rem;
        }
    }
}
.description {
    margin: 0 70px;
}
</style>
