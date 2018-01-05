const Game = function(){

  let currentRandomPizzaObj = {};

  return class Game {
    static init() {
      Game.handleEventListeners();
    }

    static handleEventListeners() {
      document.body.addEventListener('click', function(event) {
        if (event.target.id === 'start-game-modal') {
          Adapter.getPizzas().then(pizzaArray => Game.getRandomPizza(pizzaArray)).then(function(randomPizzaObj) {
            Game.renderPizzaCard(randomPizzaObj);
            Game.addEventListenersToModal();
          });
        } else if (event.target.id === 'next-pizza') {
          Game.handleNextPizza();
        } else if (event.target.name === 'topping') {
          Game.toggleNextPizzaButton();
        }

      });
    }

    static toggleNextPizzaButton() {
      document.getElementById('next-pizza').disabled = false;
    }

    static handleNextPizza() {
      document.getElementById('myModal').innerHTML = '';
      document.getElementById('myModal').innerHTML = `<div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h1 class="modal-title text-center">What's on this pizza?</h1>
          </div>
          <div class="modal-body">
            <p class="italicize text-center">Think a pizza looks delicious? Click the pizza icon to like it! Think it looks gross? Give it a thumbs down!</p>
            <img id="rando-pizza-img" style="height:250px;max-width: 100%;">
            <div class="caption text-center bold" id="pizza-img-caption">
            </div>
            <form action="#" id="pizza-game-form">

              <div class="text-center">
                <button type="button" class="btn btn-success" id="like-pizza-button"><i class="icon ion-pizza"></i></button>
                <button type="button" class="btn btn-danger" id="dislike-pizza-button"><i class="icon ion-thumbsdown"></i></button>
              </div>

              <br>
              <br>
              <div class="text-center radio-button-options">
                <input type="radio" name="topping" id="pepperoni" value="pepperoni">
                <label for="pepperoni">Pepperoni</label>
                <input type="radio" name="topping" id="mushroom" value="mushroom">
                <label for="mushroom">Mushroom</label>
                <input type="radio" name="topping" id="cheese" value="cheese">
                <label for="cheese">Cheese</label>
                <input type="radio" name="topping" id="pineapple" value="pineapple">
                <label for="pineapple">Pineapple</label>
                <br>
                <input type="textarea" id="comment-input"><button type="button" id="add-comment">Add Comment</button><br><br>
              </div>
              <div class="modal-footer">
                <div class="text-center">
                  <progress value="0" max="30" id="progressBar"></progress><span id='progress-counter'></span>
                </div>
                <input type="submit" class="btn btn-primary" id="next-pizza" value="Next Pizza" disabled>
              </form>
              </div>
          </div>
        </div>
      </div>`
      Adapter.getPizzas().then(pizzaArray => Game.getRandomPizza(pizzaArray)).then(function(randomPizzaObj) {
        Game.renderPizzaCard(randomPizzaObj);
        Game.addEventListenersToModal();
      });
    }

    static getCurrentRandomPizzaObjCopy() {
      let randomPizzaObjCopy = Object.assign({}, currentRandomPizzaObj);
      return randomPizzaObjCopy;
    }

    static addEventListenersToModal() {
      document.getElementById('pizza-game-form').addEventListener('submit', Game.nextPizzaCard);
      document.getElementById('add-comment').addEventListener('click', Game.handleNewComment);
      document.getElementById('dislike-pizza-button').addEventListener('click', Game.handleDislikeClick)
      document.getElementById('like-pizza-button').addEventListener('click', Game.handleLikeClick);
    }

    static handleLikeClick() {
      let tally = document.getElementById('tally');
      let newLikeCount = parseInt(tally.innerText);
      let currentPizzaId = Game.getCurrentRandomPizzaObjCopy().id;
      newLikeCount = newLikeCount + 1;
      tally.innerText = newLikeCount;
      this.disabled = true;
      document.getElementById('dislike-pizza-button').disabled = true;

      Adapter.updatePizza(currentPizzaId, newLikeCount);

    }

    static handleDislikeClick() {
      let tally = document.getElementById('tally');
      let newLikeCount = parseInt(tally.innerText);
      let currentPizzaId = Game.getCurrentRandomPizzaObjCopy();
      newLikeCount = newLikeCount - 1;
      tally.innerText = newLikeCount;
      this.disabled = true;
      document.getElementById('like-pizza-button').disabled = true;

      Adapter.updatePizza(currentPizzaId, newLikeCount);
    }

    static grabNewTally() {
      let tally = document.getElementById('tally');
      let newLikeCount = parseInt(tally.innerText);
      return newLikeCount;
    }

    static grabTopping() {
      let checkedTopping = document.querySelector('input[name = "topping"]:checked').value;
      return checkedTopping;
    }

    static handleNewComment() {
      let commentInput = document.getElementById('comment-input').value
      if (commentInput === '') {
      } else {
        // NEED TO BE ABLE TO PASS CURRENT LOGGED IN USER ID
        let createCommentObjForDB = Game.createCommentObjForDB(1, Game.getCurrentRandomPizzaObjCopy(), commentInput);
        Adapter.addComment(createCommentObjForDB);
      }

    }

    static nextPizzaCard() {
      event.preventDefault();
      let topping = Game.grabTopping();
      console.log(topping);
      Game.init();
    }
    // static grabComments() {
    //
    // }

    static getRandomPizza(pizzaArray) {
      let randomPizzaObj = pizzaArray[Math.floor(Math.random() * pizzaArray.length)];
      currentRandomPizzaObj = randomPizzaObj
      return randomPizzaObj;
    }

    static addAnimationsToModal() {
      let modalTitleDiv = document.getElementsByClassName('modal-title')[0];
      setTimeout(function() {
        modalTitleDiv.classList.add('animated');
        modalTitleDiv.classList.add('tada');
      }, 1000);
      setTimeout(function(){
        modalTitleDiv.classList.remove('tada');
      }, 2000);
    }

    static renderPizzaCard(randomPizzaObj) {
      document.getElementById("rando-pizza-img").src =`${randomPizzaObj.pizza_url}`;
      Game.renderPizzaCardCaption(randomPizzaObj);
      Game.addAnimationsToModal();
      Game.addCommentsToPizzaCard(randomPizzaObj);
      Game.createStatusBar();
    }

    static addScoreToPizzaCard(randomPizzaObj) {
      let tally = randomPizzaObj.tally;
      let tallySpan = document.createElement('span');
      tallySpan.setAttribute('value', `${tally}`)
      tallySpan.setAttribute('id', 'pizza-tally')
      tallySpan.innerText = `Overall score: ${tally}`;
      document.getElementById('pizza-img-caption').innerHTML += tallySpan
    }

    static addCommentsToPizzaCard(randomPizzaObj) {

    }

    static renderPizzaCardCaption(randomPizzaObj) {
      let caption = document.getElementById('pizza-img-caption');
      caption.innerHTML = `<p>Slice uploaded by ${randomPizzaObj.user.name}, Current Score: <span id='tally' value='${randomPizzaObj.tally}'>${randomPizzaObj.tally}</span></p>`
    }
    // static renderToppingOptions() {
    //   let toppingsArray = ["Mushrooms", "Pepperoni", "Plain", "Pineapple"]
    // }

    static createStatusBar() {
      let timeLeft = '';
      clearInterval();
      if (timeLeft === null) {
        console.log('hey')
      }
      console.log(document.getElementById("progressBar").value)
      console.log(document.getElementById("progressBar"))
      timeLeft = 30;
      let counter = document.getElementById("progress-counter");
      counter.innerText = `${timeLeft} seconds remaining`;
      let downloadTimer = window.setInterval(function(){
      document.getElementById("progressBar").value = 30 - --timeLeft;
      console.log(timeLeft)
      if (timeLeft === 1) {
        counter.innerText = `  ${timeLeft} second remaining`;
      } else {
        counter.innerText = `  ${timeLeft} seconds remaining`;
      }
      document.getElementById('next-pizza').addEventListener('click', function(){clearInterval(downloadTimer)})
      if (timeLeft <= 0) {
        timeLeft = null;
        clearInterval(downloadTimer);
        Game.handleNextPizza();
        //Game.init();
      }},1000);
    }

    static createCommentObjForDB(userId, pizzaId, commentInput) {
      return obj = {content: commentInput, user_id: userId, pizza_id: pizzaId}
    }

  }

}()
