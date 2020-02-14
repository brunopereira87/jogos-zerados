<template>
  <form>
    <div class="form-group">
      <label for="name">Nome:</label>
      <input type="text" v-model="name" name="name" />
    </div>

    <div class="form-group">
      <label for="plataform">Plataforma:</label>
      <select name="plataform" id="plataform" v-model="plataform">
        <option value>Escolha a plataforma</option>
        <option
          v-for="plataform in plataforms"
          :key="plataform._id"
          :value="plataform._id"
          :selected="plataform_selected === plataform._id"
        >{{plataform.name}}</option>
      </select>
    </div>

    <div class="form-group">
      <label for="developer">Desenvolvedora:</label>
      <input type="text" v-model="developer" name="developer" />
    </div>

    <div class="form-group">
      <label for="release_date">Data de Lançamento:</label>
      <input type="datetime" v-model="release_date" name="release_date" />
    </div>

    <div class="form-group">
      <label for="publisher">Publisher:</label>
      <input type="text" v-model="publisher" name="publisher" />
    </div>
    <div class="form-group">
      <label for="metacritic">Metacritic:</label>
      <input type="text" v-model="metacritic" name="metacritic" />
    </div>
    <div class="form-group fullrow">
      <label for="styles">Estilos:</label>
      <input type="text" v-model="styles" name="styles" />
    </div>
    <div class="form-group fullrow">
      <label for="video">Video:</label>
      <input type="text" v-model="video" name="video" />
    </div>
    <div class="form-group fullrow">
      <label for="artbox">Artbox:</label>
      <input type="file" name="artbox" ref="artbox" @change="onFileChange" />
      <figure class="thumbnail-preview artbox-preview" v-if="url_artbox">
        <img :src="url_artbox" />
      </figure>
    </div>
    <div class="form-group fullrow">
      <label for="screenshots">Screenshots:</label>
      <input type="file" multiple name="screenshots" @change="onMultiFilesChange" ref="screenshots" />
      <div class="previews" v-if="urls_screenshots.length > 0">
        <figure v-for="(image, key) in urls_screenshots" :key="key" class="thumbnail-preview">
          <img :ref="`image${parseInt(key)}`" />
        </figure>
      </div>
    </div>

    <slot></slot>
  </form>
</template>

<script>
import { api } from "@/services";
import { mapFields } from "@/helpers";
export default {
  name: "GameForm",
  data() {
    return {
      plataforms: [],
      url_artbox: null,
      urls_screenshots: [],
      plataform_selected: ""
    };
  },
  computed: {
    ...mapFields({
      fields: [
        "name",
        "plataform",
        "developer",
        "publisher",
        "styles",
        "artbox",
        "screenshots",
        "video",
        "release_date",
        "metacritic"
      ],
      base: "game",
      mutation: "UPDATE_GAME"
    })
  },
  methods: {
    getPlataforms() {
      api.get("/plataforms").then(response => {
        this.plataforms = response.data.plataforms;
      });
    },
    onFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();

        reader.onload = event => {
          this.url_artbox = event.target.result;
        };
        reader.readAsDataURL(file);
        this.$store.commit("UPDATE_GAME", {
          artbox: this.$refs.artbox.files[0]
        });
      }
    },
    onMultiFilesChange(event) {
      const files = event.target.files;

      for (let i = 0; i < files.length; i++) {
        this.urls_screenshots.push(files[i]);
      }

      for (let i = 0; i < this.urls_screenshots.length; i++) {
        let reader = new FileReader();
        reader.addEventListener(
          "load",
          function() {
            this.$refs[`image${parseInt(i)}`][0].src = reader.result;
          }.bind(this),
          false
        );

        reader.readAsDataURL(this.urls_screenshots[i]);
        this.$store.commit("UPDATE_GAME", {
          screenshots: this.$refs.screenshots.files
        });
      }
    }
  },
  created() {
    this.getPlataforms();
  }
};
</script>

<style lang="scss" scoped>
form {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-column-gap: 25px;
  margin-bottom: $section_margin;
}

label {
  font-weight: bold;
  // text-transform: uppercase;
  @include textcolor("light");
  text-align: left;
  margin-bottom: 5px;
}
input,
select,
label {
  display: block;
  width: 100%;
  margin-bottom: 10px;
}
input,
select {
  padding: 10px 5px;
  font-size: 1rem;
  border-radius: 5px;
  border: none;
}
.fullrow {
  grid-column: 1/-1;
}
input[type="file"] {
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: #fff;
  padding: 8px;
}
.artbox-preview {
  margin: 10px 0;
}
.thumbnail-preview {
  width: 200px;
  max-width: 100%;
  box-shadow: $shadow_default;
  display: flex;
  justify-content: center;
  align-content: center;
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
}
.previews {
  margin: $small_space 0;
  @include bgcolor("light");
  border-radius: 5px;
  display: grid;
  grid-template-columns: repeat(6, 130px);
  padding: 20px;
  justify-content: space-between;
  grid-row-gap: 30px;
  .thumbnail-preview img {
    height: 130px;
  }
}
.form-btn {
  text-align: left;
}
</style>
