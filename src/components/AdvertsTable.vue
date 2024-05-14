<script setup lang="ts">
import { RouterLink } from "vue-router";
defineProps(["advert"]);
</script>

<template>
    <RouterLink :to="{ name: 'show', params: { id: advert.id } }" class="advert">
        <span class="advert__photo">
            <img :src="advert.photo" :alt="advert.name" />
        </span>
        <span>{{ advert.name }}</span>
        <span class="advert__date">{{ new Date(advert.created_at).toLocaleString("ru-RU") }}</span>
        <span>{{ advert.price.toLocaleString("ru-RU") }} ₽ </span>
    </RouterLink>
</template>

<style scoped lang="scss">
.advert {
    display: inline-grid;
    width: 100%;
    height: 9rem;
    grid-template-columns: 11rem 1fr 8rem 9rem;
    gap: 2rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    align-items: center;
    transition: 300ms;

    @media (hover: hover) {
        &:hover {
            .advert__photo {
                // opacity: 0.9;
                filter: contrast(0.7);

                img {
                    transform: scale(1.1);
                }
            }
        }
    }

    &__photo {
        display: inline-block;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 0.5rem;
        transition: 300ms;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: 1000ms ease;
        }
    }

    &__date {
        text-align: center;
    }
}
</style>
