namespace WindowsFormsApplication1
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.button1 = new System.Windows.Forms.Button();
            this.outputBox = new System.Windows.Forms.RichTextBox();
            this.openFile = new System.Windows.Forms.OpenFileDialog();
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.button2 = new System.Windows.Forms.Button();
            this.outputBox2 = new System.Windows.Forms.RichTextBox();
            this.HigherBits = new System.Windows.Forms.CheckBox();
            this.SuspendLayout();
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(12, 74);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(459, 50);
            this.button1.TabIndex = 0;
            this.button1.Text = "Generate";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // outputBox
            // 
            this.outputBox.Font = new System.Drawing.Font("Consolas", 8.25F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.outputBox.Location = new System.Drawing.Point(12, 130);
            this.outputBox.Name = "outputBox";
            this.outputBox.Size = new System.Drawing.Size(459, 222);
            this.outputBox.TabIndex = 1;
            this.outputBox.Text = "";
            // 
            // textBox1
            // 
            this.textBox1.Location = new System.Drawing.Point(13, 42);
            this.textBox1.Name = "textBox1";
            this.textBox1.Size = new System.Drawing.Size(194, 20);
            this.textBox1.TabIndex = 2;
            // 
            // button2
            // 
            this.button2.Location = new System.Drawing.Point(213, 42);
            this.button2.Name = "button2";
            this.button2.Size = new System.Drawing.Size(258, 23);
            this.button2.TabIndex = 3;
            this.button2.Text = "Choose File";
            this.button2.UseVisualStyleBackColor = true;
            this.button2.Click += new System.EventHandler(this.button2_Click);
            // 
            // outputBox2
            // 
            this.outputBox2.Location = new System.Drawing.Point(13, 359);
            this.outputBox2.Name = "outputBox2";
            this.outputBox2.Size = new System.Drawing.Size(458, 206);
            this.outputBox2.TabIndex = 4;
            this.outputBox2.Text = "";
            // 
            // HigherBits
            // 
            this.HigherBits.AutoSize = true;
            this.HigherBits.Location = new System.Drawing.Point(474, 92);
            this.HigherBits.Name = "HigherBits";
            this.HigherBits.Size = new System.Drawing.Size(74, 17);
            this.HigherBits.TabIndex = 5;
            this.HigherBits.Text = "HigherBits";
            this.HigherBits.TextAlign = System.Drawing.ContentAlignment.TopCenter;
            this.HigherBits.UseVisualStyleBackColor = true;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(566, 577);
            this.Controls.Add(this.HigherBits);
            this.Controls.Add(this.outputBox2);
            this.Controls.Add(this.button2);
            this.Controls.Add(this.textBox1);
            this.Controls.Add(this.outputBox);
            this.Controls.Add(this.button1);
            this.Name = "Form1";
            this.Text = "pixlPlus";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.RichTextBox outputBox;
        private System.Windows.Forms.OpenFileDialog openFile;
        private System.Windows.Forms.TextBox textBox1;
        private System.Windows.Forms.Button button2;
        private System.Windows.Forms.RichTextBox outputBox2;
        private System.Windows.Forms.CheckBox HigherBits;
    }
}

