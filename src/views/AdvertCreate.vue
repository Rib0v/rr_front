<script setup lang="ts">
import LoadingIndicator from "@/components/LoadingIndicator.vue";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import { computed, ref } from "vue";
import { api } from "@/api";
import { useForm, configure } from "vee-validate";
import * as yup from "yup";
import { setLocale } from "yup";
import { ru } from "@/assets/yupLocaleRu.js";

const loading = ref(false);
const responseErrors = ref();
const createdId = ref(0);

setLocale(ru);
configure({ validateOnModelUpdate: false });

const validationSchema = yup.object({
    name: yup.string().max(200).required().label("Заголовок"),
    price: yup.number().required("Цена обязательна для заполнения").label("Цена"),
    description: yup
        .string()
        .max(1000, "${path} должно содержать не более ${max} символов")
        .required("Описание обязательно для заполнения")
        .label("Описание"),
    photo1: yup.string().max(255).required("Необходимо добавить хотя бы 1 фото").label("Фото"),
    photo2: yup.string().max(255).nullable().label("Фото"),
    photo3: yup.string().max(255).nullable().label("Фото"),
});

const { errors, defineField, handleSubmit } = useForm({ validationSchema });
const [name, nameAttrs] = defineField("name");
const [price, priceAttrs] = defineField("price");
const [description, descriptionAttrs] = defineField("description");
const [photo1, photo1Attrs] = defineField("photo1");
const [photo2, photo2Attrs] = defineField("photo2");
const [photo3, photo3Attrs] = defineField("photo3");

const errorsFromBack = computed(() => {
    const name = (responseErrors.value?.data?.errors?.name || [])[0];
    const price = (responseErrors.value?.data?.errors?.price || [])[0];
    const description = (responseErrors.value?.data?.errors?.description || [])[0];
    const photos = (responseErrors.value?.data?.errors?.photos || [])[0];

    return { name, price, description, photos };
});

const onSubmit = handleSubmit((values) => {
    const photos = [];
    if (values.photo1) photos.push(values.photo1);
    if (values.photo2) photos.push(values.photo2);
    if (values.photo3) photos.push(values.photo3);

    const query = {
        name: values.name,
        description: values.description,
        price: values.price,
        photos,
    };
    console.log(query);

    send(query);
});

async function send(payload: CreateData) {
    loading.value = true;

    try {
        const response = await api.post(`/adverts`, payload);
        createdId.value = response.data.id;
    } catch (error: any) {
        responseErrors.value = error.response;
    }

    loading.value = false;
}
</script>

<template>
    <div>
        <LoadingIndicator v-if="loading" />
        <div v-if="createdId" class="success">
            <h1>Успех!</h1>
            <p>
                Ваше объявление #{{ createdId }} успешно создано. Вы можете просмотреть его
                <RouterLink :to="{ name: 'show', params: { id: createdId } }"> по этой ссылке.</RouterLink>
            </p>
        </div>
        <form v-else @submit.prevent="onSubmit" class="form">
            <h1>Создать объявление</h1>
            <div class="group">
                <label for="name">Заголовок</label>
                <InputText
                    id="name"
                    v-model="name"
                    v-bind="nameAttrs"
                    :invalid="!!errors.name"
                    placeholder="Добавьте заголовок"
                />
                <small v-show="errors.name || errorsFromBack.name">{{ errors.name || errorsFromBack.name }}</small>
            </div>
            <div class="group">
                <label for="price">Цена</label>
                <InputNumber
                    v-model="price"
                    v-bind="priceAttrs"
                    :invalid="!!errors.price"
                    inputId="price"
                    placeholder="Укажите желаемую цену"
                />
                <small v-show="errors.price || errorsFromBack.price">{{ errors.price || errorsFromBack.price }}</small>
            </div>
            <div class="group">
                <label for="description">Текст объявления</label>
                <Textarea
                    id="description"
                    v-model="description"
                    v-bind="descriptionAttrs"
                    :invalid="!!errors.description"
                    rows="8"
                    style="resize: none"
                    placeholder="Добавьте описание до 1000 символов"
                />
                <small v-show="errors.description || errorsFromBack.description">
                    {{ errors.description || errorsFromBack.description }}
                </small>
            </div>
            <div class="photoinputs">
                <label for="photo1">Добавьте до трёх фотографий</label>
                <InputText id="photo1" v-model="photo1" v-bind="photo1Attrs" :invalid="!!errors.photo1" />
                <InputText id="photo2" v-model="photo2" v-bind="photo2Attrs" :invalid="!!errors.photo2" />
                <InputText id="photo3" v-model="photo3" v-bind="photo3Attrs" :invalid="!!errors.photo3" />
                <small v-show="errors.photo1 || errors.photo2 || errors.photo3 || errorsFromBack.photos">
                    {{ errors.photo1 || errors.photo2 || errors.photo3 || errorsFromBack.photos }}
                </small>
            </div>
            <Button :loading="loading" type="submit" label="Создать" class="button" />
        </form>
    </div>
</template>

<style scoped>
h1 {
    text-align: center;
}
label {
    color: gray;
}
.form {
    max-width: 30rem;
    margin: 1rem auto 0;
    display: grid;
    gap: 0.5rem;
}
.success {
    max-width: 30rem;
    margin: 1rem auto 0;
}
label {
    font-size: 16px;
}
small {
    color: red;
}
.group {
    display: grid;
    gap: 0.3rem;
}
.photoinputs {
    display: grid;
    gap: 0.4rem;
}
.button {
    margin-top: 0.75rem;
    height: 2.75rem;
    width: 100%;
}
</style>
