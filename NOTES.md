# Notes

Some background notes and references about this.

### Approach

Here's an overview of our approach to getting a smoothing spline.

Given a data set of $n$ points, we're looking for a function that provides a smooth approximation of the given data. Specifically, we want $\beta_i$ values in the equation:

$$
\hat{f}(x) = β_0 + β_1x + β_2x^2 + β_3x^3 + β_4(x - x_0)_+^3 + ... + β_{n+3}(x - x_{n-1})_+^3
$$

That is, we are looking for a linear combination of the functions:

$$
  f(x) =
  \begin{cases}
    1 \\
    x \\
    x^2 \\
    x^3 \\
    (x - x_0)^3_+ \\
    \vdots \\
    (x - x_{n-1})^3_+ \\
  \end{cases}
$$

> Note that the expression with a subscript + as in $(x-x_0)_+$ gives the $max(x - x_0, 0)$. Meaning $x-x_0$ must be no lower than 0.

Given this, we can draft a system of equations:

$$
\begin{cases}
y_0 = β_0 + β_1x_0 + β_2x_0^2 + β_3x_0^3 + β_4(x_0 - x_0)_+^3 + ... + β_{n+3}(x_0 - x_{n-1})_+^3 \\
y_1 = β_0 + β_1x_1 + β_2x_1^2 + β_3x_1^3 + β_4(x_1 - x_0)_+^3 + ... + β_{n+3}(x_1 - x_{n-1})_+^3 \\
\vdots \\
y_{n-1} = β_0 + β_1x_{n-1} + β_2x_{n-1}^2 + β_3x_{n-1}^3 + β_4(x_{n-1} - x_0)_+^3 + ... + β_{n+3}(x_{n-1} - x_{n-1})_+^3 \\
\end{cases}
$$

With so many letters, it's difficult to tell what the variable is. Remember: we know all the $x$'s and the $y$'s as they're part of our given data set. So, we're looking for the $\beta_i$ values that we can plug into $\hat{f}(x)$.

The system of equations above can be rewritten in matrix form as:

$$
  \bold{X\vec{\beta}=\vec{y}}
$$

Where $\bold{X}$ is

$$
\begin{bmatrix}
  1 & x_0 & x_0^2 & x_0^3 & (x_0 - x_0)^3_+ & (x_0 - x_1)^3_+ & ... & (x_0 - x_{n-1})^3_+ \\
  1 & x_1 & x_1^2 & x_1^3 & (x_1 - x_0)^3_+ & (x_1 - x_1)^3_+ & ... & (x_1 - x_{n-1})^3_+ \\
  \vdots \\
  1 & x_i & x_i^2 & x_i^3 & (x_i - x_0)^3_+ & (x_i - x_1)^3_+ & ... & (x_i - x_{n-1})^3_+ \\
  \vdots \\
  1 & x_{n-1} & x_{n-1}^2 & x_{n-1}^3 & (x_{n-1} - x_0)^3_+ & (x_{n-1} - x_1)^3_+ & ... & (x_{n-1} - x_{n-1})^3_+ \\
\end{bmatrix}
$$

And βVector is the parameters of our Spline: `[ β_0, β_1, β_2, ..., β_n+3]`
And yVector is the y values from the data: `[y_0, y_1, y_2, ... y_n-1]`

### Part 2: Ridge Regression to Solve for βVector

Solve for `β̂`

$$
β̂ = inverseMatrix(transposed(X) * X + λ*I) * transposed(X) * y`
$$

Where I is the identity matrix and λ is a new input variable that we are introducing into the model. λ controls how strongly we penalize overfitting.

```
const spline = new SmoothingSpline(matrixX, vectorY, lambda);
spline.coefficients => gives values of beta
spline.toString => prints f(x) = beta0 + beta1*x + beta2*x^2 ...
spline.toPoints(xMin, xMax, stepSize) => collection of points {x, y} from xMin to xMax
spline.getLambda()
spline.setLambda(3)
spline.getDegreesOfFreedom
```
